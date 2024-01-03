import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@nextui-org/react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownSection,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@nextui-org/react'
import { UserRound, FileEdit, LogOut, Users, MessageSquare } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuthStore, logout } from '@/stores'

export const NavSidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const userInfo = useAuthStore(state => state.userInfo)

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

      <ModeToggle />

      <Dropdown placement="top-start" showArrow>
        <DropdownTrigger>
          <Avatar className="cursor-pointer h-[48px] w-[48px]" />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          disabledKeys={['profile']}
          variant="flat"
        >
          <DropdownSection showDivider>
            <DropdownItem key="profile">{userInfo?.nickname}</DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider>
            <DropdownItem
              key="user-info"
              startContent={<UserRound className="w-5 h-5" />}
            >
              User Info
            </DropdownItem>
            <DropdownItem
              key="change-password"
              startContent={<FileEdit className="w-5 h-5" />}
            >
              Change Password
            </DropdownItem>
          </DropdownSection>

          <DropdownItem
            key="logout"
            color="danger"
            onClick={logout}
            startContent={<LogOut className="w-5 h-5" />}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
