import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class ProcessTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, path } = context.switchToHttp().getRequest()
    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        const useTime = Date.now() - now
        if (useTime > 1000) {
          Logger.warn(
            `processing \x1B[36m${method} ${path}\x1B[0m \x1B[31muse ${useTime}ms\x1B[0m`,
            ProcessTimeInterceptor.name
          )
        } else {
          Logger.log(
            `processing \x1B[36m${method} ${path}\x1B[0m \x1B[33muse ${useTime}ms\x1B[0m`,
            ProcessTimeInterceptor.name
          )
        }
      })
    )
  }
}
