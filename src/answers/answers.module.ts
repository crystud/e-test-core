import { Module } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { AnswersController } from './answers.controller'
import { TasksModule } from '../tasks/tasks.module'

@Module({
  imports: [TasksModule],
  providers: [AnswersService],
  controllers: [AnswersController],
})
export class AnswersModule {}
