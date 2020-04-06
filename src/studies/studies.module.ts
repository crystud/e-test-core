import { Module } from '@nestjs/common'
import { StudiesService } from './studies.service'
import { StudiesController } from './studies.controller'

@Module({
  exports: [StudiesService],
  providers: [StudiesService],
  controllers: [StudiesController],
})
export class StudiesModule {}
