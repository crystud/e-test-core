import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { TeachersModule } from '../teachers/teachers.module'
import { TopicsModule } from '../topics/topics.module'
import { AttemptsModule } from '../attempts/attempts.module'

@Module({
  exports: [TasksService],
  imports: [TeachersModule, TopicsModule, AttemptsModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
