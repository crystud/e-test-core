import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { CollegesService } from '../colleges/colleges.service'
import { SpecialtiesService } from './specialties.service'
import { StudiesService } from '../studies/studies.service'
import { AddStudyDto } from './dto/addStudy.dto'
import { UserRolesType } from '../enums/userRolesType'

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly specialtiesService: SpecialtiesService,
    private readonly studiesService: StudiesService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createSpecialityDto: CreateSpecialityDto,
    @Request() req,
  ): Promise<Speciality> {
    const college = await this.collegesService.findOne(
      createSpecialityDto.college,
    )

    if (await this.collegesService.isCreator(college, req.user)) {
      return await this.specialtiesService.create(createSpecialityDto, college)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') specialityID: number,
    @Request() req,
  ): Promise<Speciality> {
    const speciality = await this.specialtiesService.findOne(specialityID)
    const college = await this.collegesService.findOne(speciality.college.id)

    if (await this.collegesService.hasAccess(college, req.user))
      return speciality

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/study')
  async addStudy(
    @Body() addStudyDto: AddStudyDto,
    @Param('id') specialityId: number,
    @Request() req,
  ): Promise<Speciality> {
    const [study, speciality] = await Promise.all([
      this.studiesService.findOne(addStudyDto.study),
      this.specialtiesService.findOne(specialityId),
    ])

    const college = await this.collegesService.findOne(speciality.college.id)

    if (await this.collegesService.isEditor(college, req.user))
      return await this.specialtiesService.addStudy(speciality, study)

    throw new ForbiddenException()
  }
}
