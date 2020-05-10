import { Body, Controller, Post } from '@nestjs/common'
import { CreateAnswerDto } from './dto/createAnswer.dto'
import { Answer } from './answer.entity'
import { AnswersService } from './answers.service'
import { TasksService } from '../tasks/tasks.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto): Promise<Answer> {
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
