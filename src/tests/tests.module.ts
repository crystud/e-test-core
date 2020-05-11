import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { TeachersModule } from '../teachers/teachers.module'
import { TasksModule } from '../tasks/tasks.module'
import { TopicsModule } from '../topics/topics.module'

@Module({
  imports: [TeachersModule, TasksModule, TopicsModule],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
