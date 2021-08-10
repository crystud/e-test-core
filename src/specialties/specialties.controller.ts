import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { Speciality } from './speciality.entity'
import { FindAllSpecialityDto } from './dto/findAllSpeciality.dto'
import { AddSubjectDto } from './dto/addSubject.dto'
import { SubjectsService } from '../subject/subjects.service'
import { Subject } from '../subject/subject.entity'

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private readonly specialtiesService: SpecialtiesService,
    private readonly subjectsService: SubjectsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createSpecialityDto: CreateSpecialityDto,
  ): Promise<Speciality> {
    return await this.specialtiesService.create(createSpecialityDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('addSubject')
  async addSubject(@Body() addSubjectDto: AddSubjectDto): Promise<Speciality> {
    const [speciality, subject] = await Promise.all([
      this.specialtiesService.findEntity(addSubjectDto.speciality),
      this.subjectsService.findEntity(addSubjectDto.subject),
    ])

    return await this.specialtiesService.addSubject(speciality, subject)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') specialityId: number): Promise<Speciality> {
    return await this.specialtiesService.findOne(specialityId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() findAllSpecialityDto: FindAllSpecialityDto,
  ): Promise<Speciality[]> {
    let subject: Subject = undefined

    if (findAllSpecialityDto.subject) {
      subject = await this.subjectsService.findEntity(
        findAllSpecialityDto.subject,
      )
    }

    return await this.specialtiesService.findAll(
      findAllSpecialityDto.name,
      subject,
    )
  }
}
