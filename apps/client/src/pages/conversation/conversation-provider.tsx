import React from 'react'
import { ConversationContext, useConversationLogic } from './use-conversation'

type ConversationProviderProps = {
  children: React.ReactNode
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children
}) => {
  const { coversations, isActived, updateLastMsg } = useConversationLogic()

  return (
    <ConversationContext.Provider
      value={{
        coversations,
        isActived,
        updateLastMsg
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}
