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
import { ImageUpload } from '@/components/upload'
import { setUserInfo, useAuthStore } from '@/stores'

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

  const userInfo = useAuthStore(state => state.userInfo)

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
                <div className="flex flex-col items-center gap-3">
                  <p>User Avatar</p>
                  <ImageUpload
                    defaultUrl={userInfo?.avatar?.url}
                    handleUpload={file => userApi.uploadUserAvatar(file)}
                    onSuccess={res => {
                      setUserInfo({
                        ...userInfo!,
                        avatar: res
                      })
                    }}
                  />
                </div>
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
