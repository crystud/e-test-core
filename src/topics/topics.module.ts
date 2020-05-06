import { Module } from '@nestjs/common'
import { TopicsService } from './topics.service'
import { TopicsController } from './topics.controller'

@Module({
  exports: [TopicsService],
  providers: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
