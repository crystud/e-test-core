import { BadRequestException, Injectable } from '@nestjs/common'
import { Result } from './result.entity'
import { ResultTask } from './resultTask.entity'
import { Attempt } from '../attempts/attempt.entity'
import { Task } from '../tasks/task.entity'

@Injectable()
export class ResultsService {
  async findOne(resultId: number): Promise<Result> {
    const result = await Result.createQueryBuilder('result')
      .leftJoinAndSelect('result.resultTasks', 'resultTasks')
      .leftJoinAndSelect('resultTasks.task', 'task')
      .leftJoinAndSelect('result.attempt', 'attempt')
      .where('result.id = :resultId', { resultId })
      .getOne()

    if (!result) throw new BadRequestException('Результат не знайдено')

    return result
  }

  async entityBuilder(
    attempt: Attempt,
    score: number,
    percent: number,
  ): Promise<Result> {
    return Result.create({ attempt, score, percent })
  }

  resultTaskBuilder(
    result: Result,
    task: Task,
    correct: string[],
    incorrect: string[],
    maxScore: number,
    receivedScore: number,
  ): ResultTask {
    return ResultTask.create({
      task,
      result,
      correct,
      incorrect,
      maxScore,
      receivedScore,
    })
  }
}
