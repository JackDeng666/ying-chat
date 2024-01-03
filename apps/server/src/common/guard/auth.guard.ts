import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { RedisClientType } from 'redis'
import { AuthService } from '@/modules/user/auth.service'
import { NOT_REQUIRED_AUTH } from '@/common/decorator'
import { RedisToken } from '@/modules/redis/constant'

declare module 'express' {
  interface Request {
    userId: number
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    @Inject(RedisToken)
    private readonly redisClient: RedisClientType
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const classContext = context.getClass()
    const isNotRequiredAuth = this.reflector.getAllAndOverride<boolean>(
      NOT_REQUIRED_AUTH,
      [handler, classContext]
    )

    if (isNotRequiredAuth) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()

    try {
      const token = request.headers['authorization'].split('Bearer ')[1]

      const verifyData = this.authService.verify(token)
      const id = Number(await this.redisClient.get(token))

      if (id === verifyData.id) {
        request.userId = id
        return true
      }

      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)
    } catch (error) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}
