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

export const Register = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-[25rem]" title="Register">
        <CardHeader>Register</CardHeader>
        <Divider />
        <CardBody>
          <form>
            <Input
              endContent={<CircleUserRound />}
              label="Username"
              autoComplete="new-username"
              variant="underlined"
            />
            <Input endContent={<Mail />} label="Email" variant="underlined" />
            <Input
              endContent={<Lock />}
              type="password"
              label="Password"
              autoComplete="new-password"
              variant="underlined"
            />
            <Input
              endContent={<Lock />}
              type="password"
              label="Input password again"
              autoComplete="off"
              variant="underlined"
            />

            <Input
              label="Code"
              variant="underlined"
              maxLength={6}
              endContent={
                <Button color="primary" radius="sm">
                  Send Code
                </Button>
              }
            />

            <div className="flex flex-col gap-4 mt-4">
              <Button color="primary" type="submit">
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
