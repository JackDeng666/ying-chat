import { createContext, useContext, useMemo } from 'react'
import { useCallback } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { conversationApi } from '@/api'
import { useApi } from '@/api/use-api'
import { ConversationVo } from '@ying-chat/shared'

export const useConversationLogic = () => {
  const { pathname } = useLocation()
  const { groupId } = useParams()

  const { data } = useApi<ConversationVo[]>({
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

  return {
    coversations: data,
    isActived
  }
}

type TConversationContext = {
  coversations: ConversationVo[] | undefined
  isActived: (id: number) => boolean
}

export const ConversationContext = createContext<TConversationContext>({
  coversations: undefined,
  isActived: () => false
})

export const useConversation = () => {
  return useContext(ConversationContext)
}
