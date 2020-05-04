import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { SpecialtiesService } from './specialties.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { Speciality } from './speciality.entity'
import { FindAllSpecialityDto } from './dto/findAllSpeciality.dto'

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @ApiBearerAuth()
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
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') specialityId: number): Promise<Speciality> {
    return await this.specialtiesService.findOne(specialityId)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() findAllSpecialityDto: FindAllSpecialityDto,
  ): Promise<Speciality[]> {
    return await this.specialtiesService.findAll(findAllSpecialityDto.name)
  }
}
