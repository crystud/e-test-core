import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { CollegesService } from './colleges.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { RolesGuard } from '../auth/roles.guard'
import { UsersService } from '../users/users.service'
import { College } from './college.entity'
import { UserRolesType } from '../enums/userRolesType'
import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'

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
  @ApiCreatedResponse({
    type: College,
    description: 'Creates new college.',
  })
  async create(
    @Body() createCollegeDto: CreateCollegeDto,
    @Request() req,
  ): Promise<College> {
    let college = await this.collegesService.create(createCollegeDto, req.user)

    college = await this.collegesService.addEditor(college, req.user)

    return classToClass(college, {
      groups: [
        ...req.user.roles,
        AccessLevelType.OWNER,
        AccessLevelType.EDITOR,
      ],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: College,
    description: 'Find the college by id.',
  })
  async findOne(@Param('id') id: number, @Request() req): Promise<College> {
    const college = await this.collegesService.findOne(id)

    return classToClass(college, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  @ApiCreatedResponse({
    type: College,
    description: 'Confirm college creation.',
  })
  async confirm(@Param('id') id: number, @Request() req): Promise<College> {
    const college = await this.collegesService.confirm(id)

    return classToClass(college, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    type: [College],
    description: 'Find colleges list by filter',
  })
  async findAll(
    @Query() filterCollegeDto: FilterCollegeDto,
    @Request() req,
  ): Promise<College[]> {
    const colleges = await this.collegesService.findAll(filterCollegeDto)

    return classToClass(colleges, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own')
  @ApiOkResponse({
    type: [College],
    description: 'Find colleges list where you are the owner',
  })
  async findOwn(@Request() req): Promise<College[]> {
    const colleges = await this.collegesService.findOwn(req.user)

    return classToClass(colleges, {
      groups: [...req.user.roles, AccessLevelType.OWNER],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('editable')
  @ApiOkResponse({
    type: [College],
    description: 'Find colleges list where you are the editor',
  })
  async findEditable(@Request() req): Promise<College[]> {
    const colleges = await this.collegesService.findEditable(req.user)

    return classToClass(colleges, {
      groups: [...req.user.roles, AccessLevelType.EDITOR],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':college/editor/:user')
  @ApiCreatedResponse({
    type: College,
    description: 'Add new editor to the college',
  })
  async addEditor(
    @Param('college') collegeId: number,
    @Param('user') userId: number,
    @Request() req,
  ): Promise<College> {
    let college = await this.collegesService.findOne(collegeId)

    if (await this.collegesService.isCreator(college, req.user)) {
      const user = await this.usersService.findOne(userId)

      college = await this.collegesService.addEditor(college, user)

      return classToClass(college, {
        groups: [...req.user.roles, AccessLevelType.OWNER],
      })
    }

    throw new ForbiddenException()
  }
}
