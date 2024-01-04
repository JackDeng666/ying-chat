import { useCallback, useState, FC } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Divider,
  Accordion,
  AccordionItem,
  cn
} from '@nextui-org/react'
import { ChevronRight, PlusCircle, UserPlus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { GroupListVo, GroupVo } from '@ying-chat/shared'
import { groupApi } from '@/api'
import { useApi } from '@/api/use-api'
import { GroupModal, JoinGroupModal } from '@/components/modals'

type GroupListProps = {
  list: GroupVo[]
}

const GroupList: FC<GroupListProps> = ({ list }) => {
  const navigate = useNavigate()

  const { groupId } = useParams()
  const isActived = (currentId: number) => {
    return currentId === Number(groupId)
  }

  return (
    <div>
      {list.map((el, index) => (
        <div
          className={cn(
            'flex items-center p-2 w-full cursor-pointer',
            isActived(el.id) && 'bg-content3 dark:bg-content3'
          )}
          key={index}
          onClick={() => {
            navigate(`group/${el.id}`)
          }}
        >
          <Avatar className="mr-2 flex-shrink-0" src={el.cover?.url} />
          <p className="text-ellipsis overflow-hidden break-all whitespace-nowrap text-base">
            {el.name}
          </p>
        </div>
      ))}
    </div>
  )
}

export const Sidebar = () => {
  const { data: group, run: getGroupList } = useApi<GroupListVo>({
    func: useCallback(() => groupApi.getUserGroupList(), [])
  })

  const [openDropdown, setOpenDropdown] = useState(false)

  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [openJoinGroupModal, setOpenJoinGroupModal] = useState(false)

  return (
    <div className="w-[240px] flex flex-col bg-content2">
      <Dropdown
        className="w-[230px]"
        placement="bottom-start"
        onOpenChange={open => {
          setOpenDropdown(open)
        }}
      >
        <DropdownTrigger>
          <div className="flex justify-between text-lg p-2 cursor-pointer">
            <p>Contact</p>
            <ChevronRight
              className={cn(
                'transition-all text-sm',
                openDropdown && 'rotate-90'
              )}
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Group Actions" variant="flat">
          <DropdownItem
            key="user-info"
            startContent={<PlusCircle className="w-5 h-5" />}
            onClick={() => {
              setOpenGroupModal(true)
            }}
          >
            create a group chat
          </DropdownItem>
          <DropdownItem
            key="change-password"
            startContent={<UserPlus className="w-5 h-5" />}
            onClick={() => {
              setOpenJoinGroupModal(true)
            }}
          >
            join a group chat
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Divider />

      <Accordion
        selectionMode="multiple"
        showDivider={false}
        className="flex flex-col gap-1 w-full box-border px-0"
        itemClasses={{
          title: 'font-normal text-sm',
          trigger: 'px-2',
          indicator: 'text-xl'
        }}
      >
        <AccordionItem
          key="1"
          aria-label="The Group I Created"
          title={`The Group I Created (${group?.owner.length})`}
        >
          <GroupList list={group?.owner || []} />
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="The Group I Joined"
          title={`The Group I Joined (${group?.member.length})`}
        >
          <GroupList list={group?.member || []} />
        </AccordionItem>
      </Accordion>

      <GroupModal
        open={openGroupModal}
        close={() => setOpenGroupModal(false)}
        confirmSuccess={getGroupList}
      />

      <JoinGroupModal
        open={openJoinGroupModal}
        close={() => setOpenJoinGroupModal(false)}
        confirmSuccess={getGroupList}
      />
    </div>
  )
}
