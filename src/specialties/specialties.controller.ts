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
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { CollegesService } from '../colleges/colleges.service'
import { SpecialitysService } from './specialties.service'

@ApiTags('specialties')
@Controller('specialties')
export class SpecialitysController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly specialtiesService: SpecialitysService,
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

    if (await this.collegesService.hasAccess(speciality.college, req.user))
      return speciality

    throw new ForbiddenException()
  }
}
