import { forwardRef, Module } from '@nestjs/common'
import { StudiesService } from './studies.service'
import { StudiesController } from './studies.controller'
import { CollegesModule } from '../colleges/colleges.module'
import { SubjectsModule } from '../subjects/subjects.module'
import { UsersModule } from '../users/users.module'
import { TestsModule } from '../tests/tests.module'

@Module({
  imports: [
    CollegesModule,
    SubjectsModule,
    UsersModule,
    forwardRef(() => TestsModule),
  ],
  exports: [StudiesService],
  providers: [StudiesService],
  controllers: [StudiesController],
})
export class StudiesModule {}
