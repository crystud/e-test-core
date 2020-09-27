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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { User } from './user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserRolesType } from '../enums/userRolesType'
import { FilterUserDto } from './dto/filterUser.dto'
import { SetAvatarDto } from './dto/setAvatar.dto'

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
    const user = await this.usersService.create(registerUserDto)

    return await this.authService.createTokens(user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') userId: number): Promise<User> {
    return await this.usersService.findOne(userId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() filterUserDto: FilterUserDto): Promise<User[]> {
    return await this.usersService.findAll(
      filterUserDto.firstName,
      filterUserDto.lastName,
      filterUserDto.patronymic,
      filterUserDto.roles,
      filterUserDto.isNotInRoles,
      filterUserDto.offset,
      filterUserDto.limit,
    )
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('avatar')
  async getOwnAvatar(@Request() { user: { user } }): Promise<string> {
    return await this.usersService.getAvatar(user)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id/avatar')
  async getAvatar(@Param('id') userId: number): Promise<string> {
    const user = await this.usersService.findEntity(userId)

    return await this.usersService.getAvatar(user)
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':userId/set')
  async setAvatar(
    @Param('userId') userId: number,
    @Body() setAvatarDto: SetAvatarDto,
  ): Promise<object> {
    const user = await this.usersService.findOne(userId)

    return await this.usersService.setAvatar(user, setAvatarDto)
  }
}
