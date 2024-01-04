import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateGroupDto } from '@ying-chat/shared'
import { GroupService } from './group.service'

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: 'Create group'
  })
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupService.create(createGroupDto, req.userId)
  }

  @ApiOperation({
    summary: 'Upload group cover'
  })
  @Post('cover')
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
    return this.groupService.uploadGroupCover(file, req.userId)
  }

  @ApiOperation({
    summary: 'Join group'
  })
  @Get('join/:code')
  joinGroup(@Req() req: Request, @Param('code') code: string) {
    return this.groupService.joinGroup(req.userId, code)
  }

  @ApiOperation({
    summary: 'Get user group list'
  })
  @Get('list')
  getUserGroupList(@Req() req: Request) {
    return this.groupService.getUserGroupList(req.userId)
  }

  @ApiOperation({
    summary: 'Get group info'
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.groupService.getGroupDetail(+id, req.userId)
  }
}
