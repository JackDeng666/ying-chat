import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/modules/db/entities'
import { FileType, UpdateUserDto } from '@ying-chat/shared'
import { FileService } from '@/modules/file/file.service'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  @Inject()
  private readonly fileService: FileService

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar']
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

  async uploadUserAvatar(file: Express.Multer.File, userId: number) {
    const minioFile = await this.fileService.uploadFile({
      file,
      fileType: FileType.Avatar,
      userId
    })

    await this.userRepository.update({ id: userId }, { avatarId: minioFile.id })

    return minioFile
  }
}
