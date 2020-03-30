import { Module } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtiesController } from './specialties.controller'
import { CollegesModule } from '../colleges/colleges.module'

@Module({
  exports: [SpecialtiesService],
  imports: [CollegesModule],
  providers: [SpecialtiesService],
  controllers: [SpecialtiesController],
})
export class SpecialtiesModule {}