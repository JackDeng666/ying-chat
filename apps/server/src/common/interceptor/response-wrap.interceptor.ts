import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

type ResponseWrap<T> = {
  status: number
  data: T
  message: string
}

@Injectable()
export class ResponseWrapInterceptor<T> implements NestInterceptor<T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseWrap<T>> {
    return next.handle().pipe(
      map(data => {
        return { status: 0, data, message: 'success' }
      })
    )
  }
}
