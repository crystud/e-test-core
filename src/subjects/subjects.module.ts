import { forwardRef, Module } from '@nestjs/common'
import { SubjectsController } from './subjects.controller'
import { SubjectsService } from './subjects.service'
import { UsersModule } from '../users/users.module'
import { TopicsModule } from '../topics/topics.module'

@Module({
  exports: [SubjectsService],
  imports: [UsersModule, forwardRef(() => TopicsModule)],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
