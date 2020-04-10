import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { GroupsModule } from '../groups/groups.module'
import { StudiesModule } from '../studies/studies.module'
import { SubjectsModule } from '../subjects/subjects.module'

@Module({
  imports: [CollegesModule, GroupsModule, StudiesModule, SubjectsModule],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
