import { forwardRef, Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { SpecialtiesModule } from '../specialties/specialties.module'
import { CollegesModule } from '../colleges/colleges.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [forwardRef(() => SpecialtiesModule), CollegesModule, UsersModule],
  exports: [GroupsService],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
