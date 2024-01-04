import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  GroupEntity,
  GroupConversationEntity,
  GroupMessageEntity
} from '@/modules/db/entities'
import { ConversationService } from './conversation.service'
import { ConversationController } from './conversation.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      GroupConversationEntity,
      GroupMessageEntity
    ])
  ],
  controllers: [ConversationController],
  providers: [ConversationService]
})
export class ConversationModule {}
