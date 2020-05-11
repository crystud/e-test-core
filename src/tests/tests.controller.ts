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
import { TasksService } from '../tasks/tasks.service'
import { AddTaskDto } from './dto/addTask.dto'
import { AddTopicDto } from './dto/addTopic.dto'
import { TopicsService } from '../topics/topics.service'

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly teachersService: TeachersService,
    private readonly tasksService: TasksService,
    private readonly topicService: TopicsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() { name, countOfTasks, teacher: teacherId }: CreateTestDto,
    @Request() { user: { user, roles } },
  ): Promise<Test> {
    const teacher = await this.teachersService.findEntity(teacherId)

    if (
      !(
        this.teachersService.belongsToUser(teacher, user) ||
        roles.includes(UserRolesType.ADMIN)
      )
    )
      throw new ForbiddenException()

    return await this.testsService.create(name, countOfTasks, teacher)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':testId')
  async findOne(@Param('testId') testId: number): Promise<Test> {
    return await this.testsService.findOne(testId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('own/:teacherId')
  async findOwn(
    @Param('teacherId') teacherId: number,
    @Request() { user: { user, roles } },
  ): Promise<Test[]> {
    const teacher = await this.teachersService.findEntity(teacherId)

    if (
      !(
        this.teachersService.belongsToUser(teacher, user) ||
        roles.includes(UserRolesType.ADMIN)
      )
    )
      throw new ForbiddenException()

    return await this.testsService.findByTeacher(teacher)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('addTask')
  async addTask(
    @Body() { task: taskId, test: testId }: AddTaskDto,
  ): Promise<Test> {
    // TODO: add access check
    const [task, test] = await Promise.all([
      this.tasksService.findEntity(taskId),
      this.testsService.findEntity(testId),
    ])

    return await this.testsService.addTask(test, task)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('addTopic')
  async addTopic(
    @Body() { topic: topicId, test: testId }: AddTopicDto,
  ): Promise<Test> {
    // TODO: add access check
    const [topic, test] = await Promise.all([
      this.topicService.findEntity(topicId),
      this.testsService.findEntity(testId),
    ])

    return await this.testsService.addTopic(test, topic)
  }
}
