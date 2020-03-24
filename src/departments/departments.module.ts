import { Module } from '@nestjs/common'
import { DepartmentsService } from './departments.service'
import { DepartmentsController } from './departments.controller'
import { CollegesModule } from '../colleges/colleges.module'

@Module({
  imports: [CollegesModule],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
