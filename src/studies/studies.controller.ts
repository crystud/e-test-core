import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateStudyDto } from './dto/createStudy.dto'
import { Study } from './study.entity'
import { StudiesService } from './studies.service'
import { CollegesService } from '../colleges/colleges.service'
import { SubjectsService } from '../subjects/subjects.service'

@Controller('studies')
export class StudiesController {
  constructor(
    private readonly studiesService: StudiesService,
    private readonly collegesService: CollegesService,
    private readonly subjectsService: SubjectsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createStudyDto: CreateStudyDto,
    @Request() req,
  ): Promise<Study> {
    const [college, subject] = await Promise.all([
      this.collegesService.findOne(createStudyDto.college),
      this.subjectsService.findOne(createStudyDto.subject),
    ])

    if (await this.collegesService.isEditor(college, req.user)) {
      return await this.studiesService.create(college, subject)
    }

    throw new ForbiddenException()
  }
}
