import { Module } from '@nestjs/common'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  exports: [TeachersService],
  providers: [TeachersService],
  controllers: [TeachersController],
})
export class TeachersModule {}
