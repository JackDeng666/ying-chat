import { useParams } from 'react-router-dom'
import { ChatInput } from '@/components/chat/chat-input'
import { conversationApi } from '@/api'
import { GroupMessageType } from '@ying-chat/shared'
import { getVideoFileCover } from '@/utils'
import { ChatMessages } from './messages/messages'

export const ConversationDetail = () => {
  const { groupId } = useParams()

  const onSend = async (type: GroupMessageType, content: string | File) => {
    if (type === GroupMessageType.Text) {
      await conversationApi.sendTextGroupMessage({
        groupId: Number(groupId),
        content: content as string
      })
    } else if (type === GroupMessageType.Image) {
      await conversationApi.sendImageGroupMessage(content as File, groupId + '')
    } else if (type === GroupMessageType.Video) {
      const coverFile = await getVideoFileCover(content as File)
      await conversationApi.sendVideoGroupMessage(
        content as File,
        coverFile,
        groupId + ''
      )
    }
  }

  return (
    <div className="h-full flex flex-col bg-content3">
      <ChatMessages />
      <ChatInput onSend={onSend} />
    </div>
  )
}
