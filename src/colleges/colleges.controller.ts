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

@ApiTags('colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCollegeDto: CreateCollegeDto,
    @Request() req,
  ): Promise<CollegeInterface> {
    return await this.collegesService.create(createCollegeDto, req.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRolesType.ADMIN)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number): Promise<CollegeInterface> {
    return await this.collegesService.confirm(id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRolesType.USER, UserRolesType.ADMIN)
  @Get()
  async findAll(
    @Query() filterCollegeDto: FilterCollegeDto,
  ): Promise<CollegeInterface[]> {
    return await this.collegesService.findAll(filterCollegeDto)
  }
}
