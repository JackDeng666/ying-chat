import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common'

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.toString()
    })
  }
}
