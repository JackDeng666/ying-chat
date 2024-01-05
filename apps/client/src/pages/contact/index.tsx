import { KeepAliveOutlet } from '@/router/keep-alive'
import { Sidebar } from './sidebar'

export { ContactDetail } from './contact-detail'

export const ContactPage = () => {
  return (
    <div className="h-full flex flex-row">
      <Sidebar />

      <main className="flex-1">
        <KeepAliveOutlet />
      </main>
    </div>
  )
}
