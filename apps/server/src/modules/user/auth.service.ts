import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { customAlphabet, nanoid } from 'nanoid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegisterDto } from '@ying-chat/shared'
import { RedisKey, RedisToken } from '@/modules/redis/constant'
import { EmailService } from '@/modules/email/email.service'
import { generatePass } from '@/lib/utils'
import { UserEntity } from '@/modules/db/entities'

@Injectable()
export class AuthService {
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @Inject()
  private readonly emailService: EmailService

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

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
}
