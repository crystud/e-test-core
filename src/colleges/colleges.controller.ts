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
import { UsersService } from '../users/users.service'

@ApiTags('colleges')
@Controller('colleges')
export class CollegesController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCollegeDto: CreateCollegeDto,
    @Request() req,
  ): Promise<CollegeInterface> {
    const college = await this.collegesService.create(
      createCollegeDto,
      req.user,
    )

    return this.collegesService.format(college)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number): Promise<CollegeInterface> {
    const college = await this.collegesService.confirm(id)

    return this.collegesService.format(college)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterCollegeDto: FilterCollegeDto,
  ): Promise<CollegeInterface[]> {
    const colleges = await this.collegesService.findAll(filterCollegeDto)

    return this.collegesService.formatAll(colleges)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own')
  async findOwn(@Request() req): Promise<CollegeInterface[]> {
    const colleges = await this.collegesService.findOwn(req.user)

    return this.collegesService.formatAll(colleges)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':id/editor/:id')
  async addEditor(
    @Param('id') collegeId: number,
    @Param('id') userId: number,
  ): Promise<CollegeInterface> {
    let college = await this.collegesService.findOne(collegeId)
    const user = await this.usersService.findOne(userId)

    college = await this.collegesService.addEditor(college, user)

    return this.collegesService.format(college)
  }
}
