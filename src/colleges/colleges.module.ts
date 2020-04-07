import { Module } from '@nestjs/common'
import { CollegesService } from './colleges.service'
import { CollegesController } from './colleges.controller'
import { UsersModule } from '../users/users.module'
import { SubjectsModule } from '../subjects/subjects.module'

@Module({
  imports: [UsersModule, SubjectsModule],
  exports: [CollegesService],
  providers: [CollegesService],
  controllers: [CollegesController],
})
export class CollegesModule {}
