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
import { RegisterUserDto } from './dto/registerUser.dto'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'
import { TokensInterface } from '../auth/interfaces/tokens.interface'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { User } from './user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserRolesType } from '../enums/userRolesType'
import { classToClass } from 'class-transformer'

import { FilterUserDto } from './dto/filterUser.dto'
import { Group } from '../groups/group.entity'
import { College } from '../colleges/college.entity'
import { Ticket } from '../tickets/ticket.entity'
import { Result } from '../results/result.entity'
import { Subject } from '../subjects/subject.entity'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiCreatedResponse({
    description: 'Creates user account and return tokens.',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<TokensInterface> {
    const user = await this.usersService.createUser(registerUserDto)

    return await this.authService.createTokens(user)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: User,
    description: 'Find user by id.',
  })
  async findOne(@Param('id') userId: number, @Request() req): Promise<User> {
    const user = await this.usersService.findOne(userId)

    return classToClass(user, {
      groups: req.user.roles,
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/groups')
  @ApiOkResponse({
    type: [Group],
  })
  async findOwnGroups(@Request() req): Promise<Group[]> {
    const groups = await this.usersService.findGroups(req.user.id)

    return classToClass(groups, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/ownColleges')
  @ApiOkResponse({
    type: [College],
  })
  async findOwnOwnColleges(@Request() req): Promise<College[]> {
    const colleges = await this.usersService.findOwnColleges(req.user.id)

    return classToClass(colleges, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/editableColleges')
  @ApiOkResponse({
    type: [College],
  })
  async findOwnEditableColleges(@Request() req): Promise<College[]> {
    const groups = await this.usersService.findEditableColleges(req.user.id)

    return classToClass(groups, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/tickets')
  @ApiOkResponse({
    type: [Ticket],
  })
  async findOwnTickets(@Request() req): Promise<Ticket[]> {
    const colleges = await this.usersService.findTickets(req.user.id)

    return classToClass(colleges, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/results')
  @ApiOkResponse({
    type: [Result],
  })
  async findOwnResults(@Request() req): Promise<Result[]> {
    const results = await this.usersService.findResults(req.user.id)

    return classToClass(results, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me/subjects')
  @ApiOkResponse({
    type: [Subject],
  })
  async findOwnTeachSubjects(@Request() req): Promise<Subject[]> {
    const subjects = await this.usersService.findSubjects(req.user.id)

    return classToClass(subjects, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    type: [User],
    description: 'Find users list by filter',
  })
  async findAll(
    @Query() filterUserDto: FilterUserDto,
    @Request() req,
  ): Promise<User[]> {
    const users = await this.usersService.findAll(filterUserDto)

    return classToClass(users, {
      groups: [...req.user.roles],
    })
  }
}
