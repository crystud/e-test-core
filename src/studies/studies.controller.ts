import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateStudyDto } from './dto/createStudy.dto'
import { Study } from './study.entity'
import { StudiesService } from './studies.service'
import { CollegesService } from '../colleges/colleges.service'
import { SubjectsService } from '../subjects/subjects.service'
import { AddTeacherDto } from './dto/addTeacher.dto'
import { UsersService } from '../users/users.service'
import { AddTestDto } from './dto/addTest.dto'
import { TestsService } from '../tests/tests.service'

@ApiTags('studies')
@Controller('studies')
export class StudiesController {
  constructor(
    private readonly studiesService: StudiesService,
    private readonly collegesService: CollegesService,
    private readonly subjectsService: SubjectsService,
    private readonly usersService: UsersService,
    private readonly testsService: TestsService,
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
      try {
        await this.collegesService.addSubject(college, subject)
      } catch {}

      return await this.studiesService.create(college, subject)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/teacher')
  async addTeacher(
    @Body() addTeacherDto: AddTeacherDto,
    @Param('id') studyId,
    @Request() req,
  ): Promise<Study> {
    const [teacher, study] = await Promise.all([
      this.usersService.findOne(addTeacherDto.teacher),
      this.studiesService.findOne(studyId),
    ])

    if (await this.collegesService.isEditor(study.college, req.user)) {
      return await this.studiesService.addTeacher(study, teacher)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/test')
  async addTest(
    @Body() addTestDto: AddTestDto,
    @Param('id') studyId,
    @Request() req,
  ): Promise<Study> {
    const [test, study] = await Promise.all([
      this.testsService.findOne(addTestDto.test),
      this.studiesService.findOne(studyId),
    ])

    if (
      (await this.studiesService.isTeacher(study, req.user)) &&
      (await this.testsService.hasAccess(test, req.user))
    ) {
      return await this.studiesService.addTest(study, test)
    }

    throw new ForbiddenException()
  }
}
