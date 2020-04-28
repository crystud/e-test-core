import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'

@Module({
  exports: [PermissionsService],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
