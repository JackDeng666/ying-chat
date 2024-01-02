import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigType } from '@nestjs/config'
import { apiConfig } from '@/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true
    })
  )
  const config = new DocumentBuilder()
    .setTitle('ying chat app')
    .setDescription('a real-time chat app')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true
  })
  SwaggerModule.setup('doc', app, document)
  await app.listen(apiConf.port)
  Logger.log(
    `Application running on: http://localhost:${apiConf.port}${apiConf.prefix}`,
    'Main'
  )
}
bootstrap()
