import { Inject } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { RedisClientType } from 'redis'
import { Server, Socket } from 'socket.io'
import { Repository } from 'typeorm'
import { RedisKey, RedisToken } from '@/modules/redis/constant'
import { AuthService } from '@/modules/user/auth.service'
import { InjectRepository } from '@nestjs/typeorm'
import {
  GroupEntity,
  GroupConversationEntity,
  GroupMessageEntity
} from '@/modules/db/entities'

declare module 'socket.io' {
  interface Socket {
    userId: number
  }
}

@WebSocketGateway()
export class ConversationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @Inject()
  private readonly authService: AuthService
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @InjectRepository(GroupEntity)
  private readonly groupRepository: Repository<GroupEntity>
  @InjectRepository(GroupConversationEntity)
  private readonly groupConversationRepository: Repository<GroupConversationEntity>

  @WebSocketServer() server: Server

  private userClientMap: Map<number, string> = new Map()

  afterInit() {
    this.initGroupMap()
  }

  async initGroupMap() {
    const groups = await this.groupRepository.find({
      relations: ['users']
    })
    groups.forEach(group => {
      group.users.forEach(user => {
        this.redisClient.sAdd(`${RedisKey.GroupUsers}${group.id}`, user.id + '')
      })
    })
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization

    try {
      const verifyData = this.authService.verify(token)
      const id = Number(await this.redisClient.get(token))

      if (id === verifyData.id) {
        client.userId = id
        this.userClientMap.set(client.userId, client.id)
        return
      }
      this.authFail(client)
    } catch {
      this.authFail(client)
    }
  }

  handleDisconnect(client: Socket) {
    this.userClientMap.delete(client.userId)
  }

  authFail(client: Socket) {
    client.emit('authFail')
    client.disconnect(true)
  }

  @SubscribeMessage('update-last-msg')
  async updateLastMsg(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: number; messageId: number }
  ) {
    await this.groupConversationRepository.update(
      { id: data.id, userId: client.userId },
      { lastMsgId: data.messageId }
    )

    const groupConversation = await this.groupConversationRepository.findOne({
      where: { id: data.id, userId: client.userId }
    })

    return {
      event: 'update-last-msg',
      data: groupConversation
    }
  }

  async sendMsgToGroup(groupMsg: GroupMessageEntity) {
    const userIds = await this.redisClient.sMembers(
      `${RedisKey.GroupUsers}${groupMsg.groupId}`
    )

    userIds.forEach(userId => {
      const clientId = this.userClientMap.get(+userId)
      if (clientId) {
        this.server
          .to(clientId)
          .emit(`group-message:${groupMsg.groupId}`, groupMsg)
      }
    })
  }
}
