import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { GroupEntity, GroupConversationEntity } from '@/modules/db/entities'
import { FileService } from '@/modules/file/file.service'
import { CreateGroupDto, FileType, GroupRoleType } from '@ying-chat/shared'
import { RedisClientType } from 'redis'
import { RedisKey, RedisToken } from '@/modules/redis/constant'

@Injectable()
export class GroupService {
  @InjectRepository(GroupEntity)
  private readonly groupRepository: Repository<GroupEntity>

  @InjectRepository(GroupConversationEntity)
  private readonly groupConversationRepository: Repository<GroupConversationEntity>

  @Inject()
  private readonly fileService: FileService

  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  async create(createGroupDto: CreateGroupDto, userId: number) {
    const newGroup = new GroupEntity()
    newGroup.name = createGroupDto.name
    newGroup.description = createGroupDto.description
    newGroup.coverId = createGroupDto.coverId
    newGroup.createById = userId
    newGroup.inviteCode = nanoid()

    const group = await this.groupRepository.save(newGroup)

    const newGroupConversation = new GroupConversationEntity()
    newGroupConversation.userId = userId
    newGroupConversation.groupId = group.id
    newGroupConversation.userRole = GroupRoleType.Owner

    await this.groupConversationRepository.save(newGroupConversation)

    await this.redisClient.sAdd(
      `${RedisKey.GroupUsers}${group.id}`,
      userId + ''
    )

    return group
  }

  async uploadGroupCover(file: Express.Multer.File, userId: number) {
    const minioFile = await this.fileService.uploadFile({
      file,
      fileType: FileType.Cover,
      userId
    })

    return minioFile
  }

  async joinGroup(userId: number, inviteCode: string) {
    const group = await this.groupRepository.findOne({
      where: {
        inviteCode
      }
    })
    if (!group) {
      throw new HttpException('invite code invalid', HttpStatus.NOT_ACCEPTABLE)
    }
    const conversationExists = await this.groupConversationRepository.findOne({
      where: {
        userId,
        groupId: group.id
      }
    })
    if (conversationExists) {
      throw new HttpException(
        'you have already in the group',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const newGroupConversation = new GroupConversationEntity()
    newGroupConversation.userId = userId
    newGroupConversation.groupId = group.id
    newGroupConversation.userRole = GroupRoleType.Member
    await this.groupConversationRepository.save(newGroupConversation)
    await this.redisClient.sAdd(
      `${RedisKey.GroupUsers}${group.id}`,
      userId + ''
    )
  }

  async getUserGroupList(userId: number) {
    const groups = await this.groupConversationRepository.find({
      where: { userId },
      relations: ['group', 'group.cover']
    })

    return {
      owner: groups
        .filter(g => g.userRole === GroupRoleType.Owner)
        .map(g => ({
          ...g.group,
          inviteCode: undefined
        })),
      member: groups
        .filter(g => g.userRole === GroupRoleType.Member)
        .map(g => ({
          ...g.group,
          inviteCode: undefined
        }))
    }
  }

  async getGroupDetail(id: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      select: ['users'],
      relations: ['cover', 'users', 'users.avatar']
    })

    if (userId !== group.createById) {
      delete group.inviteCode
    }

    return group
  }
}
