import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { TestsModule } from '../tests/tests.module'
import { GroupsModule } from '../groups/groups.module'
import { TicketsModule } from '../tickets/tickets.module'
import { StudiesModule } from '../studies/studies.module'

@Module({
  imports: [TestsModule, GroupsModule, TicketsModule, StudiesModule],
  exports: [PermissionsService],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
