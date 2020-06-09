import { Module } from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { SpecialtiesController } from './specialties.controller'
import { SubjectsModule } from '../subject/subjects.module'

@Module({
  exports: [SpecialtiesService],
  imports: [SubjectsModule],
  providers: [SpecialtiesService],
  controllers: [SpecialtiesController],
})
export class SpecialtiesModule {}
