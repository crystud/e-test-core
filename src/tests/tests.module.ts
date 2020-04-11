import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { GroupsModule } from '../groups/groups.module'
import { StudiesModule } from '../studies/studies.module'
import { SubjectsModule } from '../subjects/subjects.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    CollegesModule,
    GroupsModule,
    StudiesModule,
    SubjectsModule,
    UsersModule,
  ],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
