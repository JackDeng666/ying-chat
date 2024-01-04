import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { GroupMessageListDto, SendMsgDto } from '@ying-chat/shared'
import { ConversationService } from './conversation.service'

@ApiTags('conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiOperation({
    summary: 'Get conversation list'
  })
  @Get('list')
  getGroupConversationList(@Req() req: Request) {
    return this.conversationService.getGroupConversationList(req.userId)
  }

  @ApiOperation({
    summary: 'Get group message list'
  })
  @Get('group/message/list')
  getGroupConversationMessageList(
    @Req() req: Request,
    @Query() groupMessageListDto: GroupMessageListDto
  ) {
    return this.conversationService.getGroupConversationMessageList(
      req.userId,
      groupMessageListDto
    )
  }

  @ApiOperation({
    summary: 'Send text message to group'
  })
  @Post('group/message/text')
  sendTextGroupMessage(@Req() req: Request, @Body() sendMsgDto: SendMsgDto) {
    return this.conversationService.sendTextGroupMessage(req.userId, sendMsgDto)
  }

  @ApiOperation({
    summary: 'Send image message to group'
  })
  @Post('group/message/image')
  @UseInterceptors(FileInterceptor('file'))
  sendImageGroupMessage(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'size must less than 10MB'
          }),
          new FileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ })
        ]
      })
    )
    file: Express.Multer.File,
    @Body('groupId') groupId: string
  ) {
    return this.conversationService.sendImageGroupMessage(
      req.userId,
      +groupId,
      file
    )
  }

  @ApiOperation({
    summary: 'Send video message to group'
  })
  @Post('group/message/video')
  @UseInterceptors(AnyFilesInterceptor())
  sendVideoGroupMessage(
    @Req() req: Request,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body('groupId') groupId: number
  ) {
    const videoFile = files[0]
    const coverFile = files[1]

    if (videoFile.size > 1024 * 1024 * 1024) {
      throw new HttpException(
        'video size must be less than 1GB',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    if (coverFile.size > 5 * 1024 * 1024) {
      throw new HttpException(
        'cover size must be less than 5MB',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    return this.conversationService.sendVideoGroupMessage(
      req.userId,
      +groupId,
      videoFile,
      coverFile
    )
  }
}
