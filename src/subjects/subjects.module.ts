import { Module } from '@nestjs/common'
import { SubjectsController } from './subjects.controller'
import { SubjectsService } from './subjects.service'
import { UsersModule } from '../users/users.module'
import { CollegesModule } from '../colleges/colleges.module'
import { SpecialtiesModule } from '../specialties/specialties.module'
import { GroupsModule } from '../groups/groups.module'

@Module({
  exports: [SubjectsService],
  imports: [UsersModule, CollegesModule, SpecialtiesModule, GroupsModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
