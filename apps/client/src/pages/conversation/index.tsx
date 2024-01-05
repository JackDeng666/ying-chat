import { KeepAliveOutlet } from '@/router/keep-alive'
import { Sidebar } from './sidebar'
import { ConversationProvider } from './conversation-provider'

export { ConversationDetail } from './conversation-detail'

export const ConversationPage = () => {
  return (
    <ConversationProvider>
      <div className="h-full flex flex-row">
        <Sidebar />

        <main className="flex-1">
          <KeepAliveOutlet />
        </main>
      </div>
    </ConversationProvider>
  )
}
