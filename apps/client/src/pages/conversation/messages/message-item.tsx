import { forwardRef, memo, useMemo, useRef } from 'react'
import moment from 'moment'
import { Avatar, Image, cn } from '@nextui-org/react'
import { useAuthStore, openPreview } from '@/stores'
import { GroupMessageType, GroupMessageVo } from '@ying-chat/shared'

type ChatMessageItemProps = {
  message: GroupMessageVo
}

const MessageItem = memo(
  forwardRef<HTMLDivElement, ChatMessageItemProps>(
    ({ message }, messageItemRef) => {
      const userInfo = useAuthStore(state => state.userInfo)

      const isCurrentUser = useMemo(() => {
        return message.userId === userInfo?.id
      }, [userInfo, message])

      return (
        <div
          ref={messageItemRef}
          className={cn(
            'flex min-w-[400px] p-4',
            'hover:bg-content2',
            isCurrentUser && 'flex-row-reverse'
          )}
        >
          <Avatar
            className="flex-shrink-0 h-14 w-14"
            src={message.user.avatar?.url}
          />
          <div
            className={cn(
              'flex flex-col items-start mx-2',
              isCurrentUser && 'items-end'
            )}
          >
            <div
              className={cn('flex mb-2', isCurrentUser && 'flex-row-reverse')}
            >
              <p className="text-sm font-semibold text-foreground-700">
                {message.user.nickname}
              </p>
              <p className="text-sm mx-2 text-foreground-500">
                {moment(message.createAt).format('YYYY-MM-DD HH:mm:ss')}
              </p>
            </div>
            {message.type === GroupMessageType.Text && (
              <p className="whitespace-pre-wrap text-foreground">
                {message.content}
              </p>
            )}
            {message.type === GroupMessageType.Image && (
              <Image
                src={message.file?.url}
                className="w-auto h-[200px] cursor-pointer"
                onClick={() => openPreview('image', message.file!.url)}
              />
            )}

            {message.type === GroupMessageType.Video && (
              <Image
                className="w-auto h-[200px] cursor-pointer"
                src={message.cover?.url}
                onClick={() => openPreview('video', message.file!.url)}
              />
            )}
          </div>
        </div>
      )
    }
  ),
  (prevProps, nextProps) => {
    return prevProps.message.id === nextProps.message.id
  }
)

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const messageItemRef = useRef(null)

  return <MessageItem ref={messageItemRef} message={message} />
}
