import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { TestsModule } from '../tests/tests.module'

@Module({
  imports: [TestsModule],
  exports: [PermissionsService],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
