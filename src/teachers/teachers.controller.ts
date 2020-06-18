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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { Teacher } from './teachers.entity'
import { CreateTeacherDto } from './dto/createTeacher.dto'
import { TeachersService } from './teachers.service'
import { UsersService } from '../users/users.service'
import { TeacherInfoInterface } from './interfaces/teacherInfo.interface'

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return await this.teachersService.create(
      createTeacherDto.user,
      createTeacherDto.subject,
    )
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own')
  async own(@Request() { user: { user } }): Promise<Teacher[]> {
    return await this.teachersService.findByUser(user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') teacherId: number): Promise<Teacher> {
    return await this.teachersService.findOne(teacherId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('byUser/:userId')
  async findByUser(@Param('userId') userId: number): Promise<Teacher[]> {
    const user = await this.usersService.findEntity(userId)

    return await this.teachersService.findByUser(user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getInfo/own')
  async getInfo(@Request() { user: { user } }): Promise<TeacherInfoInterface> {
    const teachers = await this.teachersService.findByUser(user)

    return await this.teachersService.getInfo(user, teachers)
  }
}
