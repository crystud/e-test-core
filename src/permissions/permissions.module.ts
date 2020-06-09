import { forwardRef, Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { TeachersModule } from '../teachers/teachers.module'
import { TestsModule } from '../tests/tests.module'
import { GroupsModule } from '../groups/groups.module'
import { TicketsModule } from '../tickets/tickets.module'

@Module({
  imports: [
    TeachersModule,
    forwardRef(() => TestsModule),
    GroupsModule,
    TicketsModule,
  ],
  exports: [PermissionsService],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
