import { Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { SpecialitysModule } from '../specialties/specialties.module'
import { CollegesModule } from '../colleges/colleges.module'

@Module({
  imports: [SpecialitysModule, CollegesModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
