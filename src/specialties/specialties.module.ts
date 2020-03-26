import { Module } from '@nestjs/common'
import { SpecialitysService } from './specialties.service'
import { SpecialitysController } from './specialties.controller'
import { CollegesModule } from '../colleges/colleges.module'

@Module({
  imports: [CollegesModule],
  providers: [SpecialitysService],
  controllers: [SpecialitysController],
})
export class SpecialitysModule {}
