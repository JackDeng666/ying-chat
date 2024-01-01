import { Controller, Post } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  @Post('login')
  login() {
    return 'login success'
  }

  @Post('register')
  register() {
    return 'register success'
  }
}
