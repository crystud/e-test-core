import { forwardRef, Module } from '@nestjs/common'
import { AttemptsService } from './attempts.service'
import { AttemptsController } from './attempts.controller'
import { TicketsModule } from '../tickets/tickets.module'
import { TestsModule } from '../tests/tests.module'
import { PermissionsModule } from '../permissions/permissions.module'
import { TasksModule } from '../tasks/tasks.module'
import { ResultsModule } from '../results/results.module'

@Module({
  exports: [AttemptsService],
  imports: [
    TicketsModule,
    forwardRef(() => TasksModule),
    forwardRef(() => TestsModule),
    PermissionsModule,
    ResultsModule,
  ],
  providers: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
