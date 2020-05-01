import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SubjectsService } from './subjects.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Subject } from './subject.entity'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { FilterSubjectDto } from './dto/filterSubject.dto'
import { UserRolesType } from '../enums/userRolesType'
import { classToClass } from 'class-transformer'
import { TopicsService } from '../topics/topics.service'

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly topicsService: TopicsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Request() req,
  ): Promise<Subject> {
    const subject = await this.subjectsService.create(
      createSubjectDto,
      req.user,
    )

    const topic = await this.topicsService.create(
      {
        subject: subject.id,
        name: 'Без теми',
      },
      req.user,
      subject,
    )

    await this.topicsService.confirm(topic)

    return classToClass(subject, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterSubjectDto: FilterSubjectDto,
    @Request() req,
  ): Promise<Subject[]> {
    const subjects = await this.subjectsService.findAll(filterSubjectDto)

    return classToClass(subjects, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number, @Request() req): Promise<Subject> {
    const subject = await this.subjectsService.confirm(id)

    return classToClass(subject, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Subject,
    description: 'Find the subject by id.',
  })
  async findOne(
    @Param('id') subjectId: number,
    @Request() req,
  ): Promise<Subject> {
    const subject = await this.subjectsService.findOne(subjectId)

    return classToClass(subject, {
      groups: [...req.user.roles],
    })
  }
}
