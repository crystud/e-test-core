import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { UsersModule } from '../users/users.module'

@Module({
  exports: [StudentsService],
  imports: [UsersModule],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
