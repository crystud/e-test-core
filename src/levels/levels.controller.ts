import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Level } from './level.entity'
import { LevelsService } from './levels.service'
import { TestsService } from '../tests/tests.service'
import { CreateLevelDto } from './dto/createLevel.dto'
import { classToClass } from 'class-transformer'
import { TasksService } from '../tasks/tasks.service'

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly testsService: TestsService,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Level,
    description: 'Add new level to test',
  })
  async create(
    @Body() createLevelDto: CreateLevelDto,
    @Request() req,
  ): Promise<Level> {
    const test = await this.testsService.findOne(createLevelDto.test)

    const level = await this.levelsService.create(createLevelDto, test)

    return classToClass(level, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Level,
    description: 'Find level by id',
  })
  async findOne(@Param('id') levelId: number, @Request() req): Promise<Level> {
    const level = await this.levelsService.findOne(levelId)

    return classToClass(level, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':levelId/task/:taskId')
  async addTask(
    @Param('levelId') levelId: number,
    @Param('taskId') taskId: number,
    @Request() req,
  ): Promise<Level> {
    const [level, task] = await Promise.all([
      this.levelsService.findOne(levelId),
      this.tasksService.findOne(taskId),
    ])

    const test = await this.testsService.findOne(level.test.id)

    if (await this.testsService.hasAccess(test, req.user)) {
      const addedTask = await this.levelsService.addTask(level, task)

      return classToClass(addedTask, {
        groups: [...req.user.roles],
      })
    }

    throw new ForbiddenException()
  }
}
