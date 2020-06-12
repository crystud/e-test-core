import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'

import { GroupsModule } from '../groups/groups.module'

import { StudentsModule } from '../students/students.module'

@Module({
  exports: [MessagesService],
  imports: [GroupsModule, StudentsModule],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
