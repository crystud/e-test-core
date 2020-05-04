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
    const user = await this.usersService.create(registerUserDto)

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
}
