import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'
import { CreateTaskDto } from './dto/createTask.dto'
import { Task } from './task.entity'
import { TasksService } from './tasks.service'
import { TopicsService } from '../topics/topics.service'

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly topicsService: TopicsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Task,
    description: 'Creates new task.',
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ): Promise<Task> {
    const topic = await this.topicsService.findOne(createTaskDto.topic)

    const task = await this.tasksService.create(createTaskDto, topic)

    return classToClass(task, {
      groups: [...req.user.roles, AccessLevelType.OWNER],
    })
  }
}
