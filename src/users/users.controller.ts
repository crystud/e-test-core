import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { RegisterUserDto } from './dto/registerUser.dto'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'
import { TokensInterface } from '../auth/interfaces/tokens.interface'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { User } from './user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserRolesType } from '../enums/userRolesType'
import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
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
  @Get('me')
  async findMe(@Request() req): Promise<User> {
    const user = await this.usersService.findOne(req.user.id)
    return classToClass(user, {
      groups: [...req.user.roles, AccessLevelType.OWN],
    })
  }
}
