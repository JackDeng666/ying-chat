import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import {
  apiConfig,
  dbConfig,
  emailConfig,
  minioConfig,
  redisConfig
} from '@/config'
import { DbModule } from '@/modules/db/db.module'
import { RedisModule } from '@/modules/redis/redis.module'
import { UserModule } from '@/modules/user/user.module'
import { EmailModule } from '@/modules/email/email.module'
import { FileModule } from '@/modules/file/file.module'
import { GroupModule } from '@/modules/group/group.module'
import { ConversationModule } from '@/modules/conversation/conversation.module'
import { AuthGuard } from '@/common/guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, dbConfig, redisConfig, emailConfig, minioConfig]
    }),
    DbModule,
    RedisModule,
    EmailModule,
    FileModule,
    UserModule,
    GroupModule,
    ConversationModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
