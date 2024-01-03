import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/modules/db/entities'
import { UpdateUserDto } from '@ying-chat/shared'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    })

    if (!user) {
      throw new HttpException('user is not exists', HttpStatus.NOT_FOUND)
    }

    return user
  }

  async updateUserInfo(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const user = await this.userRepository.findOne({
        where: { username: updateUserDto.username }
      })
      if (user && user.id !== userId) {
        throw new HttpException(
          'username already exists',
          HttpStatus.NOT_ACCEPTABLE
        )
      }
    }

    await this.userRepository.update({ id: userId }, updateUserDto)
  }
}
