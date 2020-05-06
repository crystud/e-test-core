import { Module } from '@nestjs/common'
import { TestsService } from './tests.service'
import { TestsController } from './tests.controller'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [TeachersModule],
  providers: [TestsService],
  controllers: [TestsController],
})
export class TestsModule {}
