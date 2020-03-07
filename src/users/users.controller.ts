import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { RegisterUserDto } from './dto/registerUser.dto'
import { UsersService } from './users.service'
import { User } from './user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.usersService.createUser(registerUserDto)

    return user
  }
}
