import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  Avatar,
  AvatarGroup,
  Button,
  CircularProgress,
  Divider,
  Snippet,
  Tooltip
} from '@nextui-org/react'
import { MessageSquare } from 'lucide-react'
import { groupApi } from '@/api'
import { useApi } from '@/api/use-api'
import { GroupVo } from '@ying-chat/shared'

export const ContactDetail = () => {
  const { groupId } = useParams()
  const { loading, data } = useApi<GroupVo>({
    func: useCallback(() => groupApi.getGroupInfo(groupId!), [groupId])
  })

  const Detail = () => {
    if (!data) {
      return null
    }

    return (
      <div className="w-[50%] h-[50%]">
        <div className="flex items-center">
          <Avatar src={data.cover?.url} className="w-24 h-24" />
          <p className="text-ellipsis overflow-hidden break-all whitespace-nowrap text-2xl ml-4 flex-1">
            {data.name}
          </p>
          <Button color="primary" isIconOnly className="rounded-full w-16 h-16">
            <MessageSquare size={30} />
          </Button>
        </div>

        <Divider className="my-4" />

        {data.inviteCode && (
          <div className="mb-2 flex justify-between items-center">
            <p className="text-lg mb-1">邀请码</p>
            <Snippet symbol="" className="bg-content4 dark:bg-content4">
              {data.inviteCode}
            </Snippet>
          </div>
        )}

        <div className="mb-2">
          <p className="text-lg mb-1">群介绍</p>
          <p className="break-all">{data.description}</p>
        </div>

        <div className="mb-2">
          <p className="text-lg mb-1">群成员({data.users?.length})</p>
          <AvatarGroup className="justify-start" size="lg">
            {data.users?.map(user => (
              <Tooltip content={user.nickname} key={user.id}>
                <Avatar src={user.avatar?.url} isBordered />
              </Tooltip>
            ))}
          </AvatarGroup>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full fc overflow-y-auto no-scrollbar bg-content3">
      {loading ? (
        <CircularProgress size="lg" aria-label="Loading..." />
      ) : (
        <Detail />
      )}
    </div>
  )
}
