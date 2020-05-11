import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateTaskDto } from './dto/createTask.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { TopicsService } from '../topics/topics.service'
import { TasksService } from './tasks.service'
import { TeachersService } from '../teachers/teachers.service'
import { Task } from './task.entity'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly teachersService: TeachersService,
    private readonly topicsService: TopicsService,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const [creator, topic] = await Promise.all([
      this.teachersService.findEntity(createTaskDto.creator),
      this.topicsService.findEntity(createTaskDto.topic),
    ])

    return await this.tasksService.create(
      createTaskDto.question,
      createTaskDto.image,
      createTaskDto.type,
      createTaskDto.attachment,
      topic,
      creator,
    )
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') taskId: number): Promise<Task> {
    return await this.tasksService.findOne(taskId)
  }
}
