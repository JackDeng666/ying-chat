import { useNavigate, useLocation } from 'react-router-dom'
import { Users, MessageSquare } from 'lucide-react'
import { cn } from '@nextui-org/react'

export const NavSidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col gap-4 items-center w-[72px] py-4 bg-content1">
      <div className="flex-1 flex flex-col gap-2">
        <div
          className={cn(
            `fc text-xl w-[48px] h-[48px] cursor-pointer rounded-full transition-all duration-700`,
            'hover:rounded-2xl text-foreground bg-default',
            pathname.startsWith('/conversation') && 'rounded-2xl bg-primary'
          )}
          onClick={() => {
            navigate('/conversation', { replace: true })
          }}
        >
          <MessageSquare />
        </div>
        <div
          className={cn(
            `fc text-xl w-[48px] h-[48px] cursor-pointer rounded-full transition-all duration-700`,
            'hover:rounded-2xl text-foreground bg-default',
            pathname.startsWith('/contact') && 'rounded-2xl bg-primary'
          )}
          onClick={() => {
            navigate('/contact', { replace: true })
          }}
        >
          <Users />
        </div>
      </div>
    </div>
  )
}
