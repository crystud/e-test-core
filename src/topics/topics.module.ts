import { Module } from '@nestjs/common'
import { TopicsService } from './topics.service'
import { TopicsController } from './topics.controller'
import { SubjectsModule } from '../subjects/subjects.module'

@Module({
  imports: [SubjectsModule],
  exports: [TopicsService],
  providers: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
