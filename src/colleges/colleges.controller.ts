import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
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
import { UsersService } from '../users/users.service'
import { College } from './college.entity'

@ApiTags('colleges')
@Controller('colleges')
export class CollegesController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCollegeDto: CreateCollegeDto,
    @Request() req,
  ): Promise<College> {
    return await this.collegesService.create(createCollegeDto, req.user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number): Promise<College> {
    return await this.collegesService.confirm(id)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterCollegeDto: FilterCollegeDto,
  ): Promise<College[]> {
    return await this.collegesService.findAll(filterCollegeDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own')
  async findOwn(@Request() req): Promise<College[]> {
    return await this.collegesService.findOwn(req.user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('editable')
  async findEditable(@Request() req): Promise<College[]> {
    return await this.collegesService.findEditable(req.user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/editor/:id')
  async addEditor(
    @Param('id') collegeId: number,
    @Param('id') userId: number,
  ): Promise<College> {
    const college = await this.collegesService.findOne(collegeId)
    const user = await this.usersService.findOne(userId)

    return await this.collegesService.addEditor(college, user)
  }
}
