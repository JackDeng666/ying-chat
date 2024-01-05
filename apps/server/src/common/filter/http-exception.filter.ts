import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import { createReadStream } from 'fs'
import { join } from 'path'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception.getStatus()
    const exceptionRes = exception.getResponse()

    if (
      status === HttpStatus.NOT_FOUND &&
      !request.url.startsWith('/api') &&
      process.env.NODE_ENV === 'prod'
    ) {
      const indexFile = createReadStream(
        join(process.cwd(), 'public/index.html')
      )
      indexFile.pipe(response)
      return
    }

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
