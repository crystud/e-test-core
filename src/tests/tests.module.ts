import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { GroupsModule } from '../groups/groups.module'

@Module({
  imports: [CollegesModule, GroupsModule],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
