import { Module } from '@nestjs/common'
import { StudiesService } from './studies.service'
import { StudiesController } from './studies.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { SubjectsModule } from '../subjects/subjects.module'

@Module({
  imports: [CollegesModule, SubjectsModule],
  exports: [StudiesService],
  providers: [StudiesService],
  controllers: [StudiesController],
})
export class StudiesModule {}
