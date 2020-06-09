import { Module } from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { StudentsModule } from '../students/students.module'

@Module({
  imports: [StudentsModule],
  exports: [TicketsService],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
