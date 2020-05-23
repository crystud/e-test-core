import { Module } from '@nestjs/common'
import { AttemptsService } from './attempts.service'
import { AttemptsController } from './attempts.controller'
import { TicketsModule } from '../tickets/tickets.module'
import { TestsModule } from '../tests/tests.module'
import { PermissionsModule } from '../permissions/permissions.module'
import { TasksModule } from '../tasks/tasks.module'

@Module({
  imports: [TicketsModule, TestsModule, PermissionsModule, TasksModule],
  providers: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
