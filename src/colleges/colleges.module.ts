import { Module } from '@nestjs/common'
import { CollegesService } from './colleges.service'
import { CollegesController } from './colleges.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  providers: [CollegesService],
  controllers: [CollegesController],
})
export class CollegesModule {}
