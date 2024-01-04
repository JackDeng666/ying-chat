import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
export { ContactDetail } from './contact-detail'

export const ContactPage = () => {
  return (
    <div className="h-full flex flex-row">
      <Sidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
