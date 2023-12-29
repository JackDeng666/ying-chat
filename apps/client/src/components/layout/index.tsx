import { Outlet } from 'react-router-dom'
import { NavSidebar } from './nav-sidebar'

export const AppLayout = () => {
  return (
    <div className="h-full flex flex-row">
      <NavSidebar />

      <main className="h-full flex-1">
        <Outlet />
      </main>
    </div>
  )
}
