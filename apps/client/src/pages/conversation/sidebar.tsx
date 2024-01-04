import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Badge, cn } from '@nextui-org/react'
import {
  ConversationVo,
  GroupMessageType,
  GroupMessageVo
} from '@ying-chat/shared'
import { useConversation } from './use-conversation'

const renderMessage = (message?: GroupMessageVo) => {
  if (!message) return ''
  let recentMsg = message.user.nickname + ': '

  switch (message.type) {
    case GroupMessageType.Text:
      recentMsg = recentMsg + message.content
      break
    case GroupMessageType.Image:
      recentMsg = recentMsg + '[图片]'
      break
    case GroupMessageType.Video:
      recentMsg = recentMsg + '[视频]'
      break
  }

  return recentMsg
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const { groupId } = useParams()

  const { coversations, isActived } = useConversation()

  const handleClick = (conversation: ConversationVo) => {
    if (conversation.groupId !== Number(groupId)) {
      const routeKey = `group/${conversation.groupId}`
      navigate(routeKey)
    }
  }

  return (
    <div className="w-60 py-4 overflow-y-auto no-scrollbar flex flex-col bg-content2">
      {coversations?.map(el => (
        <Badge
          content={el.unreadNum}
          color="danger"
          shape="rectangle"
          isInvisible={!el.unreadNum}
          key={el.id}
        >
          <div
            className={cn(
              'flex p-2 w-full cursor-pointer',
              isActived(el.id) && 'bg-content3'
            )}
            onClick={() => handleClick(el)}
          >
            <Avatar
              radius="sm"
              className="mr-2 flex-shrink-0"
              src={el.group.cover.url}
            />

            <div className="flex-1 w-0">
              <div className="flex justify-between">
                <p className="text-sm">{el.group.name}</p>
              </div>

              <p className="text-sm text-foreground-500 text-ellipsis overflow-hidden break-all whitespace-nowrap">
                {renderMessage(el.recentMsg)}
              </p>
            </div>
          </div>
        </Badge>
      ))}
    </div>
  )
}
