import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input
} from '@nextui-org/react'
import { CircleUserRound, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { LoginDto } from '@ying-chat/shared'
import { authApi } from '@/api'
import { useAuthStore, login } from '@/stores'

const resolver = classValidatorResolver(LoginDto)

export const Login = () => {
  const navigate = useNavigate()

  const [svgData, setSvgData] = useState('')

  const sessionUid = useAuthStore(state => state.sessionUid)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginDto>({
    resolver,
    defaultValues: {
      uid: sessionUid
    }
  })

  const getCaptcha = useCallback(async () => {
    try {
      const data = await authApi.getCaptcha(sessionUid)
      setSvgData(data)
    } catch {}
  }, [sessionUid])

  useEffect(() => {
    getCaptcha()
  }, [getCaptcha])

  const onFinish = async (values: LoginDto) => {
    try {
      await login(values)
      navigate('/')
      toast.success('login success!')
    } catch {}
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-[25rem]">
        <CardHeader>Login</CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit(onFinish)}>
            <Input
              variant="underlined"
              label="loginName"
              autoComplete="loginName"
              endContent={<CircleUserRound />}
              isInvalid={Boolean(errors.loginName)}
              errorMessage={errors.loginName?.message}
              {...register('loginName')}
            />
            <Input
              label="Password"
              variant="underlined"
              endContent={<Lock />}
              type="password"
              autoComplete="password"
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Code"
              variant="underlined"
              maxLength={4}
              isInvalid={Boolean(errors.code)}
              errorMessage={errors.code?.message}
              endContent={
                <div
                  className="bg-white cursor-pointer w-[120px] h-[40px]"
                  dangerouslySetInnerHTML={{ __html: svgData }}
                  onClick={getCaptcha}
                ></div>
              }
              {...register('code')}
            />

            <div className="flex flex-col gap-4 mt-4">
              <Button color="primary" type="submit">
                Log in
              </Button>
              <Button
                onClick={() => {
                  navigate('/register')
                }}
                variant="ghost"
              >
                Register now
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
