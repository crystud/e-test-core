import { Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { SpecialtiesModule } from '../specialties/specialties.module'
import { CollegesModule } from '../colleges/colleges.module'

@Module({
  imports: [SpecialtiesModule, CollegesModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
