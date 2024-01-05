import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, MoreThan, Repository } from 'typeorm'
import {
  FileType,
  GroupMessageListDto,
  GroupMessageType,
  SendMsgDto
} from '@ying-chat/shared'
import { FileService } from '@/modules/file/file.service'
import {
  GroupConversationEntity,
  GroupMessageEntity
} from '@/modules/db/entities'
import { ConversationGateway } from './conversation.gateway'

@Injectable()
export class ConversationService {
  @InjectRepository(GroupConversationEntity)
  private readonly groupConversationRepository: Repository<GroupConversationEntity>

  @InjectRepository(GroupMessageEntity)
  private readonly groupMessageRepository: Repository<GroupMessageEntity>

  @Inject()
  private readonly fileService: FileService

  @Inject()
  private readonly conversationGateway: ConversationGateway

  async getGroupConversationList(userId: number) {
    const res = await this.groupConversationRepository.find({
      where: {
        userId
      },
      relations: ['group', 'group.cover'],
      order: {
        updateAt: 'DESC'
      }
    })
    return res
  }

  async getGroupConversationMessageList(
    userId: number,
    groupMessageListDto: GroupMessageListDto
  ) {
    await this.checkUserInGroup(userId, groupMessageListDto.groupId)

    return this.groupMessageRepository.find({
      where: {
        groupId: groupMessageListDto.groupId,
        id: groupMessageListDto.cursorId
          ? LessThan(groupMessageListDto.cursorId)
          : undefined
      },
      order: {
        id: 'DESC'
      },
      take: groupMessageListDto.size || 10,
      relations: ['user', 'user.avatar', 'file', 'cover']
    })
  }

  async sendTextGroupMessage(userId: number, sendMsgDto: SendMsgDto) {
    await this.checkUserInGroup(userId, sendMsgDto.groupId)

    const message = new GroupMessageEntity()
    message.userId = userId
    message.groupId = sendMsgDto.groupId
    message.content = sendMsgDto.content
    message.type = GroupMessageType.Text

    const res = await this.groupMessageRepository.save(message)

    this.sendMsgToGroup(res.id)

    return res
  }

  async sendImageGroupMessage(
    userId: number,
    groupId: number,
    file: Express.Multer.File
  ) {
    await this.checkUserInGroup(userId, groupId)

    const minioFile = await this.fileService.uploadFile({
      file,
      fileType: FileType.Image,
      userId
    })

    const message = new GroupMessageEntity()
    message.userId = userId
    message.groupId = groupId
    message.type = GroupMessageType.Image
    message.fileId = minioFile.id

    const res = await this.groupMessageRepository.save(message)

    this.sendMsgToGroup(res.id)

    return res
  }

  async sendVideoGroupMessage(
    userId: number,
    groupId: number,
    videoFile: Express.Multer.File,
    coverFile: Express.Multer.File
  ) {
    await this.checkUserInGroup(userId, groupId)

    const [minioVideoFile, minioCoverFile] = await Promise.all([
      this.fileService.uploadFile({
        file: videoFile,
        fileType: FileType.Video,
        userId
      }),
      this.fileService.uploadFile({
        file: coverFile,
        fileType: FileType.Cover,
        userId
      })
    ])

    const message = new GroupMessageEntity()
    message.userId = userId
    message.groupId = groupId
    message.type = GroupMessageType.Video
    message.fileId = minioVideoFile.id
    message.coverId = minioCoverFile.id

    const res = await this.groupMessageRepository.save(message)

    this.sendMsgToGroup(res.id)

    return res
  }

  async checkUserInGroup(userId: number, groupId: number) {
    const exist = await this.groupConversationRepository.findOne({
      where: {
        userId,
        groupId
      }
    })
    if (!exist) {
      throw new HttpException(
        'you are not in the group!',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }

  findRecentGroupMessage(groupId: number) {
    return this.groupMessageRepository.findOne({
      where: {
        groupId
      },
      order: {
        id: 'DESC'
      },
      relations: ['user']
    })
  }

  findUnreadGroupMessageNum(groupId: number, lastMsgId: number) {
    return this.groupMessageRepository.count({
      where: {
        groupId,
        id: MoreThan(lastMsgId)
      }
    })
  }

  async sendMsgToGroup(id: number) {
    const newMessage = await this.groupMessageRepository.findOne({
      where: { id },
      relations: ['user', 'user.avatar', 'file', 'cover']
    })

    this.conversationGateway.sendMsgToGroup(newMessage)
  }
}
