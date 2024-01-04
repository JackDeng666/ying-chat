import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupEntity, GroupConversationEntity } from '@/modules/db/entities'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupConversationEntity])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
