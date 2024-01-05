import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { GroupConversationEntity } from '@/modules/db/entities'
import { ConversationService } from './conversation.service'

@EventSubscriber()
export class GroupConversationSubscriber
  implements EntitySubscriberInterface<GroupConversationEntity>
{
  constructor(
    dataSource: DataSource,
    private conversationService: ConversationService
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return GroupConversationEntity
  }

  async afterLoad(entity: GroupConversationEntity) {
    entity.recentMsg = await this.conversationService.findRecentGroupMessage(
      entity.groupId
    )

    if (entity.lastMsgId) {
      entity.unreadNum =
        await this.conversationService.findUnreadGroupMessageNum(
          entity.groupId,
          entity.lastMsgId
        )
    }
  }
}
