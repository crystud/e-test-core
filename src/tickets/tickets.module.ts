import { Module } from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { AttemptsModule } from '../attempts/attempts.module'

@Module({
  imports: [AttemptsModule],
  exports: [TicketsService],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
