import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'getUserInfo'
  })
  @Get(':id')
  getUserInfo(@Param('id') id: number) {
    return this.userService.getUserInfo(id)
  }
}
