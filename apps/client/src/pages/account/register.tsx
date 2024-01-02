import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input
} from '@nextui-org/react'
import { CircleUserRound, Mail, Lock } from 'lucide-react'
import { RegisterDtoWithSubPass } from '@ying-chat/shared'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { authApi } from '@/api'

const resolver = classValidatorResolver(RegisterDtoWithSubPass)

export const Register = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<RegisterDtoWithSubPass>({
    resolver
  })

  const [sendCodeLoading, setSendCodeLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const sendCode = async () => {
    const email = getValues('email')

    if (!email) {
      return toast.warning('Please input your email first!')
    }
    try {
      setSendCodeLoading(true)
      await authApi.sendCode(email)
      toast.success('send code success!')
    } catch {
    } finally {
      setSendCodeLoading(false)
    }
  }

  const registerAccount = async (values: RegisterDtoWithSubPass) => {
    try {
      setRegisterLoading(true)
      await authApi.register(Object.assign(values, { subPassword: undefined }))
      toast.success('register success!')
      navigate('/login')
    } catch {
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-[25rem]" title="Register">
        <CardHeader>Register</CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit(registerAccount)}>
            <Input
              endContent={<CircleUserRound />}
              label="Username"
              autoComplete="new-username"
              variant="underlined"
              isInvalid={Boolean(errors.username)}
              errorMessage={errors.username?.message}
              {...register('username')}
            />
            <Input
              endContent={<Mail />}
              label="Email"
              variant="underlined"
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <Input
              endContent={<Lock />}
              type="password"
              label="Password"
              autoComplete="new-password"
              variant="underlined"
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
              {...register('password')}
            />
            <Input
              endContent={<Lock />}
              type="password"
              label="Input password again"
              autoComplete="off"
              variant="underlined"
              isInvalid={Boolean(errors.subPassword)}
              errorMessage={errors.subPassword?.message}
              {...register('subPassword')}
            />

            <Input
              label="Code"
              variant="underlined"
              maxLength={6}
              isInvalid={Boolean(errors.code)}
              errorMessage={errors.code?.message}
              {...register('code')}
              endContent={
                <Button
                  color="primary"
                  radius="sm"
                  isLoading={sendCodeLoading}
                  onClick={sendCode}
                >
                  Send Code
                </Button>
              }
            />

            <div className="flex flex-col gap-4 mt-4">
              <Button color="primary" type="submit" isLoading={registerLoading}>
                Register now
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate('/login')
                }}
              >
                Log in now
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
