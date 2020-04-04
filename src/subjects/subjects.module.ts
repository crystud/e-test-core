import { Module } from '@nestjs/common'
import { SubjectsController } from './subjects.controller'
import { SubjectsService } from './subjects.service'
import { UsersModule } from '../users/users.module'

@Module({
  exports: [SubjectsService],
  imports: [UsersModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
