import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { UpdateUserDto } from '@ying-chat/shared'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'getUserInfo'
  })
  @Get()
  getUserInfo(@Req() request: Request) {
    return this.userService.getUserInfo(request.userId)
  }

  @ApiOperation({
    summary: 'updateUserInfo'
  })
  @Post()
  updateUserInfo(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUserInfo(request.userId, updateUserDto)
  }
}
