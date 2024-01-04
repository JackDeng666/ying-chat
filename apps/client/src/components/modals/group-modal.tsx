import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  cn
} from '@nextui-org/react'
import { FC, useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CreateGroupDto } from '@ying-chat/shared'
import { groupApi } from '@/api'
import { ImageUpload } from '@/components/upload/image-upload'

type UserInfoModalProps = {
  open: boolean
  close: () => void
  confirmSuccess?: () => void
}

const resolver = classValidatorResolver(CreateGroupDto)

export const GroupModal: FC<UserInfoModalProps> = ({
  open,
  close,
  confirmSuccess
}) => {
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateGroupDto>({
    resolver
  })

  const [confirmLoading, setConfirmLoading] = useState(false)

  const onFinish = async (values: CreateGroupDto) => {
    try {
      setConfirmLoading(true)
      await groupApi.createGroup(values)
      toast.success('Group chat successfully created!')
      close()
      confirmSuccess && confirmSuccess()
      reset()
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
              Create group info
            </ModalHeader>
            <form onSubmit={handleSubmit(onFinish)}>
              <ModalBody>
                <Input
                  label="Group Name"
                  maxLength={32}
                  {...register('name')}
                  isInvalid={Boolean(errors.name)}
                  errorMessage={errors.name?.message}
                />
                <Textarea
                  label="Group Description"
                  maxRows={3}
                  maxLength={100}
                  {...register('description')}
                  isInvalid={Boolean(errors.description)}
                  errorMessage={errors.description?.message}
                />
                <p
                  className={cn(
                    'text-sm text-foreground-500',
                    Boolean(errors.coverId) && 'text-danger'
                  )}
                >
                  Group Cover
                </p>
                <div>
                  <ImageUpload
                    aria-label="cover"
                    handleUpload={(file: File) =>
                      groupApi.uploadGroupCover(file)
                    }
                    onSuccess={minioFile => {
                      setValue('coverId', minioFile.id)
                    }}
                  />
                </div>
                <p className="text-tiny text-danger">
                  {errors.coverId?.message}
                </p>
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
                  type="submit"
                  isLoading={confirmLoading}
                >
                  Create
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
