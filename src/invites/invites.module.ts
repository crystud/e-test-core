import { Module } from '@nestjs/common'
import { InvitesService } from './invites.service'
import { InvitesController } from './invites.controller'
import { GroupsModule } from '../groups/groups.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [GroupsModule, AuthModule],
  providers: [InvitesService],
  controllers: [InvitesController],
})
export class InvitesModule {}
