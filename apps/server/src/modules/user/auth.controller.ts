import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Headers
} from '@nestjs/common'
import { Response } from 'express'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LoginDto, RegisterDto } from '@ying-chat/shared'
import { NotRequiredAuth } from '@/common/decorator'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'register'
  })
  @Post('register')
  @NotRequiredAuth()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({
    summary: 'sendCode',
    description: 'send email verification code for register'
  })
  @Post('sendCode')
  @NotRequiredAuth()
  sendCode(@Body('email') email: string) {
    return this.authService.sendCode(email)
  }

  @ApiOperation({
    summary: 'catpcha'
  })
  @Get('/catpcha')
  @NotRequiredAuth()
  async getCaptcha(@Query('uid') uid: string, @Res() res: Response) {
    res.send(await this.authService.getCaptcha(uid))
  }

  @ApiOperation({
    summary: 'login'
  })
  @Post('login')
  @NotRequiredAuth()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @ApiOperation({
    summary: 'logout'
  })
  @Get('logout')
  logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization.split('Bearer ')[1])
  }
}
