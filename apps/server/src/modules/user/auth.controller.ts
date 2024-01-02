import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from '@ying-chat/shared'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login() {
    return 'login success'
  }

  @ApiOperation({
    summary: 'register'
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({
    summary: 'sendCode',
    description: 'send email verification code for register'
  })
  @Post('sendCode')
  sendCode(@Body('email') email: string) {
    return this.authService.sendCode(email)
  }
}
