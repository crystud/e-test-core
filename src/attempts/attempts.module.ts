import { Module } from '@nestjs/common'
import { AttemptsService } from './attempts.service'
import { AttemptsController } from './attempts.controller'

@Module({
  exports: [AttemptsService],
  providers: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
