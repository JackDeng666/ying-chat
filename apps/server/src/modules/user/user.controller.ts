import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { UpdateUserDto } from '@ying-chat/shared'
import { UserService } from './user.service'
import { FileInterceptor } from '@nestjs/platform-express'

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

  @ApiOperation({
    summary: 'uploadUserAvatar'
  })
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadUserAvatar(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'size must less than 5MB'
          }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.userService.uploadUserAvatar(file, req.userId)
  }
}
