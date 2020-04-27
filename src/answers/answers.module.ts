import { Module } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { AnswersController } from './answers.controller'

@Module({
  exports: [AnswersService],
  providers: [AnswersService],
  controllers: [AnswersController],
})
export class AnswersModule {}
