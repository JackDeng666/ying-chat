import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircularProgress } from '@nextui-org/react'
import { GroupMessageVo } from '@ying-chat/shared'
import { conversationApi } from '@/api'
import { ScollBox, ScollBoxHandle } from '@/components/scroll-box'
import { ChatMessageItem } from './message-item'

const SIZE = 30

const useMessages = () => {
  const navigate = useNavigate()
  const { groupId } = useParams()

  const topMessageId = useRef(0)
  const [messages, setMessageList] = useState<GroupMessageVo[]>([])
  const [firstLoaded, setFirstLoaded] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const addPrevMessage = useCallback((prevMessage: GroupMessageVo[]) => {
    setMessageList(messages => [...prevMessage, ...messages])
  }, [])

  const addNewMessage = useCallback((newMessage: GroupMessageVo) => {
    setMessageList(messages => [...messages, newMessage])
  }, [])

  const loadMessages = async (groupId: number, cursorId?: number) => {
    const res = await conversationApi.getGroupConversationMessageList({
      groupId,
      size: SIZE,
      cursorId: cursorId || undefined
    })
    if (!res.length || res.length < SIZE) {
      setLoaded(true)
    }
    return res
  }

  useEffect(() => {
    if (messages.length) {
      topMessageId.current = messages[0].id
    }
  }, [messages])

  const loadPrevMessages = useCallback(async () => {
    console.log('loadPrevMessages')
    if (!groupId) return
    const res = await loadMessages(Number(groupId), topMessageId.current)
    addPrevMessage(res.reverse())
  }, [groupId, addPrevMessage])

  const firstLoadMessages = useCallback(async () => {
    console.log('firstLoadMessages', groupId)
    if (!groupId) return
    try {
      const res = await loadMessages(Number(groupId))
      setMessageList(res.reverse())
      setFirstLoaded(true)
    } catch (error) {
      navigate('/conversation', { replace: true })
    }
  }, [groupId, navigate])

  useEffect(() => {
    firstLoadMessages()
  }, [firstLoadMessages])

  return {
    messages,
    firstLoaded,
    loaded,
    addNewMessage,
    loadPrevMessages
  }
}

export const ChatMessages = () => {
  const scrollBoxRef = useRef<ScollBoxHandle>(null)
  const { messages, firstLoaded, loaded, loadPrevMessages } = useMessages()

  useEffect(() => {
    if (firstLoaded) {
      scrollBoxRef.current?.scrollToBottom()
    }
  }, [firstLoaded])

  const onTop = useCallback(() => {
    if (!loaded) {
      scrollBoxRef.current?.keepPosition(loadPrevMessages)
    }
  }, [loaded, loadPrevMessages])

  return (
    <div className="flex-1 h-[1px] relative">
      <ScollBox className="h-full" ref={scrollBoxRef} onTop={onTop}>
        <div className="w-full flex justify-center my-4" aria-label="tip">
          {!loaded ? (
            <CircularProgress aria-label="loading" />
          ) : (
            <p className="text-sm text-foreground-500">no more messages</p>
          )}
        </div>
        {messages.map(el => (
          <ChatMessageItem key={el.id} message={el} />
        ))}
      </ScollBox>
    </div>
  )
}
