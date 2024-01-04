import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@nextui-org/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { groupApi } from '@/api'

type JoinGroupModalProps = {
  open: boolean
  close: () => void
  confirmSuccess?: () => void
}

export const JoinGroupModal = ({
  open,
  close,
  confirmSuccess
}: JoinGroupModalProps) => {
  const [inviteCode, setInviteCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleJoin = async () => {
    if (!inviteCode) {
      return setErrorMessage('Please input invite code!')
    }
    setErrorMessage('')
    try {
      setConfirmLoading(true)
      await groupApi.joinGroup(inviteCode)
      toast.success('Join the group chat successfully!')
      setInviteCode('')
      close()
      confirmSuccess && confirmSuccess()
    } catch {
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal isOpen={open} onClose={close} isDismissable={false}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Join a group chat
            </ModalHeader>
            <ModalBody>
              <Input
                label="Invite Code"
                variant="underlined"
                maxLength={32}
                value={inviteCode}
                onChange={e => {
                  setInviteCode(e.target.value)
                }}
                isInvalid={Boolean(errorMessage)}
                errorMessage={errorMessage}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="ghost"
                isDisabled={confirmLoading}
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                color="primary"
                isLoading={confirmLoading}
                onPress={handleJoin}
              >
                Join
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
