import { Outlet } from 'react-router-dom'
import { useAuthRoute } from '@/router/use-auth-route'
import { NavSidebar } from './nav-sidebar'

export const AppLayout = () => {
  return useAuthRoute(
    <div className="h-full flex flex-row">
      <NavSidebar />

      <main className="h-full flex-1">
        <Outlet />
      </main>
    </div>
  )
}
