import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigType } from '@nestjs/config'
import { apiConfig } from '@/config'
import { Logger } from '@nestjs/common'
import {
  ProcessTimeInterceptor,
  ResponseWrapInterceptor
} from '@/common/interceptor'
import { OtherExceptionFilter, HttpExceptionFilter } from '@/common/filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const apiConf = app.get<ConfigType<typeof apiConfig>>(apiConfig.KEY)
  app.setGlobalPrefix(apiConf.prefix)
  app.useGlobalInterceptors(new ProcessTimeInterceptor())
  app.useGlobalInterceptors(new ResponseWrapInterceptor())
  app.useGlobalFilters(new OtherExceptionFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(apiConf.port)
  Logger.log(
    `Application running on: http://localhost:${apiConf.port}${apiConf.prefix}`,
    'Main'
  )
}
bootstrap()
