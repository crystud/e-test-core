import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsController } from './admins.controller'

@Module({
  exports: [AdminsService],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
