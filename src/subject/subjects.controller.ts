import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { SubjectsService } from './subjects.service'
import { Subject } from './subject.entity'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { FindAllSubjectsDto } from './dto/findAllSubjects.dto'
import { TopicsService } from '../topics/topics.service'

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly topicsService: TopicsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = await this.subjectsService.create(createSubjectDto)

    await this.topicsService.create({ subject: subject.id, name: 'Без теми' })

    return subject
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') subjectId: number): Promise<Subject> {
    return await this.subjectsService.findOne(subjectId)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() findAllSubjectsDto: FindAllSubjectsDto,
  ): Promise<Subject[]> {
    return await this.subjectsService.findAll(
      findAllSubjectsDto.name,
      findAllSubjectsDto.specialties,
    )
  }
}
