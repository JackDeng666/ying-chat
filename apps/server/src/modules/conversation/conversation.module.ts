import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  GroupEntity,
  GroupConversationEntity,
  GroupMessageEntity
} from '@/modules/db/entities'
import { UserModule } from '@/modules/user/user.module'
import { ConversationService } from './conversation.service'
import { ConversationController } from './conversation.controller'
import { GroupConversationSubscriber } from './conversation.subscriber'
import { ConversationGateway } from './conversation.gateway'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      GroupConversationEntity,
      GroupMessageEntity
    ]),
    UserModule
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    GroupConversationSubscriber,
    ConversationGateway
  ]
})
export class ConversationModule {}
