import { Module } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { SubjectsController } from './subjects.controller'
import { TopicsModule } from '../topics/topics.module'

@Module({
  imports: [TopicsModule],
  exports: [SubjectsService],
  providers: [SubjectsService],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
