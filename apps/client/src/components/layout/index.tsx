import { useAuthRoute } from '@/router/use-auth-route'
import { KeepAliveOutlet } from '@/router/keep-alive'
import { SocketProvider } from '@/socket'
import { NavSidebar } from './nav-sidebar'

export const AppLayout = () => {
  return useAuthRoute(
    <SocketProvider>
      <div className="h-full flex flex-row">
        <NavSidebar />

        <main className="h-full flex-1">
          <KeepAliveOutlet />
        </main>
      </div>
    </SocketProvider>
  )
}
