import { createContext, useContext, useEffect, useMemo } from 'react'
import { useCallback } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { conversationApi } from '@/api'
import { useApi } from '@/api/use-api'
import { ConversationVo, GroupMessageVo } from '@ying-chat/shared'
import { useSocket } from '@/socket'
import { debounce } from '@/utils'

export const useConversationLogic = () => {
  const { pathname } = useLocation()
  const { groupId } = useParams()

  const { data, setData } = useApi<ConversationVo[]>({
    func: useCallback(() => conversationApi.getConversationList(), [])
  })

  const currentConversation = useMemo(() => {
    if (pathname.startsWith('/conversation/group/')) {
      const conversation = data?.find(el => el.groupId === Number(groupId))
      return conversation
    }

    return undefined
  }, [data, pathname, groupId])

  const isActived = useCallback(
    (currentId: number) => {
      return currentId === currentConversation?.id
    },
    [currentConversation]
  )

  const { socket } = useSocket()

  const updateLastMsgCache = useCallback(
    (messageId: number) => {
      if (!currentConversation || currentConversation.lastMsgId >= messageId)
        return

      socket?.emit('update-last-msg', {
        id: currentConversation.id,
        messageId
      })
    },
    [socket, currentConversation]
  )

  const updateLastMsg = debounce(updateLastMsgCache, 200)

  const handleNewMessage = useCallback(
    (message: GroupMessageVo) => {
      setData(
        prevData =>
          prevData?.map(el => {
            if (el.groupId === message.groupId) {
              return {
                ...el,
                recentMsg: message,
                unreadNum: el.unreadNum + 1
              }
            }
            return el
          })
      )
    },
    [setData]
  )

  useEffect(() => {
    data?.forEach(el => {
      socket?.on(`group-message:${el.groupId}`, handleNewMessage)
    })

    return () => {
      data?.forEach(el => {
        socket?.off(`group-message:${el.groupId}`, handleNewMessage)
      })
    }
  }, [socket, data, handleNewMessage])

  useEffect(() => {
    const handleUpdateConversation = (conversation: ConversationVo) => {
      setData(
        prevData =>
          prevData?.map(el => {
            if (el.id === conversation.id) {
              return {
                ...el,
                lastMsgId: conversation.lastMsgId,
                unreadNum: conversation.unreadNum
              }
            }
            return el
          })
      )
    }
    socket?.on('update-last-msg', handleUpdateConversation)

    return () => {
      socket?.off('update-last-msg', handleUpdateConversation)
    }
  }, [socket, setData])

  return {
    coversations: data,
    isActived,
    updateLastMsg
  }
}

type TConversationContext = {
  coversations: ConversationVo[] | undefined
  isActived: (id: number) => boolean
  updateLastMsg: (msgId: number) => void
}

export const ConversationContext = createContext<TConversationContext>({
  coversations: undefined,
  isActived: () => false,
  updateLastMsg: () => {}
})

export const useConversation = () => {
  return useContext(ConversationContext)
}
