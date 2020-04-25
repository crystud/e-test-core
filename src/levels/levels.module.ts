import { Module } from '@nestjs/common'
import { LevelsService } from './levels.service'
import { LevelsController } from './levels.controller'
import { TestsModule } from '../tests/tests.module'
import { TasksModule } from '../tasks/tasks.module'

@Module({
  imports: [TestsModule, TasksModule],
  exports: [LevelsService],
  providers: [LevelsService],
  controllers: [LevelsController],
})
export class LevelsModule {}
