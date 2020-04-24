import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { TopicsModule } from '../topics/topics.module'

@Module({
  imports: [TopicsModule],
  exports: [TasksService],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
