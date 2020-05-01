import { Injectable } from '@nestjs/common'
import { Answer } from './answer.entity'
import { Task } from '../tasks/task.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreateAnswerDto } from './dto/createAnswer.dto'

@Injectable()
export class AnswersService {
  async create(createAnswerDto: CreateAnswerDto, task: Task): Promise<Answer> {
    try {
      const answer = await Answer.create({
        ...createAnswerDto,
        task,
      }).save()

      return await this.findOne(answer.id)
    } catch (e) {
      if (e.name === 'QueryFailedError' && e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestExceptionError({
          property: 'field',
          value: '',
          constraints: {
            duplicate: e.message,
          },
        })
      }
    }
  }

  async findOne(id: number): Promise<Answer> {
    const answer = await Answer.findOne({
      where: {
        id,
      },
      relations: ['task', 'task.answers'],
    })

    if (!answer) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'answer is not exist',
        },
      })
    }

    return answer
  }
}
