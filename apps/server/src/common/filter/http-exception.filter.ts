import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    const exceptionRes = exception.getResponse()

    const error =
      typeof exceptionRes === 'string'
        ? { message: exceptionRes }
        : (exceptionRes as object)

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...error
    })
  }
}
