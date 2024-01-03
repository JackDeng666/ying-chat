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
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { UpdateUserDto } from '@ying-chat/shared'
import { userApi } from '@/api'

type UserInfoModalProps = {
  open: boolean
  close: () => void
  confirmSuccess?: () => void
  initialValues: UpdateUserDto
}

const resolver = classValidatorResolver(UpdateUserDto)

export const UserInfoModal = ({
  open,
  close,
  confirmSuccess,
  initialValues
}: UserInfoModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateUserDto>({
    resolver
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onFinish = async (values: UpdateUserDto) => {
    try {
      setConfirmLoading(true)
      await userApi.updateUserInfo(values)
      toast.success('update user info successfully!')
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
            <ModalHeader className="flex flex-col gap-1">User Info</ModalHeader>
            <form onSubmit={handleSubmit(onFinish)}>
              <ModalBody>
                <Input
                  label="Username"
                  maxLength={20}
                  defaultValue={initialValues.username}
                  isInvalid={Boolean(errors.username)}
                  errorMessage={errors.username?.message}
                  {...register('username')}
                />
                <Input
                  label="Nickname"
                  maxLength={20}
                  defaultValue={initialValues.nickname}
                  isInvalid={Boolean(errors.nickname)}
                  errorMessage={errors.nickname?.message}
                  {...register('nickname')}
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
                  type="submit"
                >
                  Update
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
