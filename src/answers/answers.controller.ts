import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateAnswerDto } from './dto/createAnswer.dto'
import { Answer } from './answer.entity'
import { AnswersService } from './answers.service'
import { TasksService } from '../tasks/tasks.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private readonly tasksService: TasksService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto): Promise<Answer> {
    // TODO: add access check
    const task = await this.tasksService.findEntity(createAnswerDto.task)

    return this.answersService.create(
      createAnswerDto.answerText,
      createAnswerDto.correct,
      createAnswerDto.position,
      createAnswerDto.image,
      task,
    )
  }
}
