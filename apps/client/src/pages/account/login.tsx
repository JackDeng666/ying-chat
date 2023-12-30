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

export const Login = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-[25rem]">
        <CardHeader>Login</CardHeader>
        <Divider />
        <CardBody>
          <form>
            <Input
              variant="underlined"
              label="loginName"
              autoComplete="loginName"
              endContent={<CircleUserRound />}
            />
            <Input
              label="Password"
              variant="underlined"
              endContent={<Lock />}
              type="password"
              autoComplete="password"
            />

            <Input label="Code" variant="underlined" maxLength={4} />

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
