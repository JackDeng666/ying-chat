import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { customAlphabet, nanoid } from 'nanoid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { create } from 'svg-captcha'
import { LoginDto, RegisterDto } from '@ying-chat/shared'
import { RedisKey, RedisToken } from '@/modules/redis/constant'
import { EmailService } from '@/modules/email/email.service'
import { comparePass, generatePass } from '@/lib/utils'
import { UserEntity } from '@/modules/db/entities'
import { JwtService } from '@nestjs/jwt'
import { ConfigType } from '@nestjs/config'
import { apiConfig } from '@/config'

@Injectable()
export class AuthService {
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @Inject()
  private readonly emailService: EmailService

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  @Inject()
  private readonly jwtService: JwtService

  @Inject(apiConfig.KEY)
  private readonly apiConfig: ConfigType<typeof apiConfig>

  async sendCode(email: string) {
    const expireTime = await this.redisClient.expireTime(
      RedisKey.RegisterCode + email
    )
    if (expireTime > 0) {
      const dv = expireTime - Math.floor(Date.now() / 1000)
      if (dv > 2 * 60) {
        throw new HttpException(
          'please try again in 1 minutes',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }

    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      throw new HttpException(
        'user email already exists',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const nanoid = customAlphabet('1234567890', 6)
    const code = nanoid()
    await this.emailService.sendMail(
      email,
      'Verification code',
      `
        <p>Your verification code is:</p>
        <div style="width: 100px;height: 35px;">${code}</div>
        <p style="color:#999;">effective within 3 minutes</p>
      `
    )
    await this.redisClient.set(RedisKey.RegisterCode + email, code, {
      EX: 3 * 60
    })
  }

  async register(registerDto: RegisterDto) {
    const registerCode = await this.redisClient.get(
      RedisKey.RegisterCode + registerDto.email
    )
    if (!registerCode || registerCode !== registerDto.code) {
      throw new HttpException(
        'email verification code is incorrect',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const user = await this.userRepository.findOne({
      where: { username: registerDto.username }
    })
    if (user) {
      throw new HttpException(
        'username already exists',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const newUser = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      nickname: 'ying#' + nanoid(8),
      password: generatePass(registerDto.password)
    })

    await this.userRepository.save(newUser)
    await this.redisClient.del(RedisKey.RegisterCode + registerDto.email)
  }

  async getCaptcha(uid: string) {
    const newCaptcha = create({ width: 100, height: 35, noise: 4 })
    await this.redisClient.set(RedisKey.LoginCode + uid, newCaptcha.text, {
      EX: 3 * 60
    })
    return newCaptcha.data
  }

  compareCode(codeA: string, codeB: string) {
    return codeA.toLowerCase() === codeB.toLowerCase()
  }

  async login(loginDto: LoginDto) {
    const code = await this.redisClient.get(RedisKey.LoginCode + loginDto.uid)
    if (!code || !this.compareCode(code, loginDto.code)) {
      throw new HttpException(
        { message: 'captcha error' },
        HttpStatus.NOT_ACCEPTABLE
      )
    }
    const user = await this.userRepository.findOne({
      where: [
        {
          username: loginDto.loginName
        },
        {
          email: loginDto.loginName
        }
      ]
    })
    if (!user) {
      throw new HttpException(
        { message: 'account does not exist' },
        HttpStatus.NOT_ACCEPTABLE
      )
    }
    if (!comparePass(loginDto.password, user.password)) {
      throw new HttpException(
        { message: 'wrong password' },
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const token = this.jwtService.sign(
      {
        id: user.id
      },
      {
        secret: this.apiConfig.jwtSecret
      }
    )

    await this.redisClient.set(token, user.id, {
      EX: 24 * 60 * 60
    })

    await this.redisClient.del(RedisKey.RegisterCode + user.email)

    return {
      user,
      token
    }
  }

  verify(token: string) {
    return this.jwtService.verify(token, { secret: this.apiConfig.jwtSecret })
  }

  async logout(token: string) {
    await this.redisClient.del(token)
  }
}
