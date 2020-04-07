import { Module } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtiesController } from './specialties.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { StudiesModule } from '../studies/studies.module'

@Module({
  exports: [SpecialtiesService],
  imports: [CollegesModule, StudiesModule],
  providers: [SpecialtiesService],
  controllers: [SpecialtiesController],
})
export class SpecialtiesModule {}
