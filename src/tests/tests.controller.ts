import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
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

import { CreateTestDto } from './dto/createTest.dto'
import { TestsService } from './tests.service'
import { TeachersService } from '../teachers/teachers.service'
import { Test } from './test.entity'

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly teachersService: TeachersService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() { name, teacher: teacherId }: CreateTestDto,
    @Request() { user: { user, roles } },
  ): Promise<Test> {
    const teacher = await this.teachersService.findEntity(teacherId)

    if (roles.includes(UserRolesType.ADMIN) || teacher.user.id !== user.id)
      throw new ForbiddenException()

    return await this.testsService.create(name, teacher)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own/:teacherId')
  async findOwn(
    @Param('teacherId') teacherId: number,
    @Request() { user: { user } },
  ): Promise<Test[]> {
    const teacher = await this.teachersService.findEntity(teacherId)

    if (teacher.user.id !== user.id) throw new ForbiddenException()

    return await this.testsService.findByTeacher(teacher)
  }
}
