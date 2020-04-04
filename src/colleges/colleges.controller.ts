import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
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
import { CollegesService } from './colleges.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { RolesGuard } from '../auth/roles.guard'
import { UsersService } from '../users/users.service'
import { College } from './college.entity'
import { SubjectsService } from '../subjects/subjects.service'

@ApiTags('colleges')
@Controller('colleges')
export class CollegesController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly usersService: UsersService,
    private readonly subjectsService: SubjectsService,
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
    const college = await this.collegesService.create(
      createCollegeDto,
      req.user,
    )

    return await this.collegesService.addEditor(college, req.user)
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
  @Post(':college/editor/:user')
  async addEditor(
    @Param('college') collegeId: number,
    @Param('user') userId: number,
    @Request() req,
  ): Promise<College> {
    const college = await this.collegesService.findOne(collegeId)

    if (await this.collegesService.isEditor(college, req.user)) {
      const user = await this.usersService.findOne(userId)

      return await this.collegesService.addEditor(college, user)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':college/subject/:subject')
  async addSubject(
    @Param('college') collegeId: number,
    @Param('subject') subjectId: number,
    @Request() req,
  ): Promise<College> {
    const college = await this.collegesService.findOne(collegeId)

    if (await this.collegesService.isEditor(college, req.user)) {
      const subject = await this.subjectsService.findOne(subjectId)

      return await this.collegesService.addSubject(college, subject)
    }

    throw new ForbiddenException()
  }
}
