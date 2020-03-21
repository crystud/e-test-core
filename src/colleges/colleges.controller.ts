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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { CollegeInterface } from './interfaces/college.interface'
import { CollegesService } from './colleges.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { RolesGuard } from '../auth/roles.guard'

@ApiTags('colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCollegeDto: CreateCollegeDto,
    @Request() req,
  ): Promise<CollegeInterface> {
    return await this.collegesService.create(createCollegeDto, req.user)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number): Promise<CollegeInterface> {
    return await this.collegesService.confirm(id)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterCollegeDto: FilterCollegeDto,
  ): Promise<CollegeInterface[]> {
    return await this.collegesService.findAll(filterCollegeDto)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own')
  async findOwn(@Request() req): Promise<CollegeInterface[]> {
    return await this.collegesService.findOwn(req.user)
  }
}
