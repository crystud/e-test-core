import { Injectable } from '@nestjs/common'
import { Result } from './result.entity'

@Injectable()
export class ResultsService {
  async findOne(id: number): Promise<Result> {
    return await Result.findOne({
      where: {
        id,
      },
      relations: ['attempt', 'resultAnswers', 'student'],
    })
  }

  async findByIds(ids: number[]): Promise<Result[]> {
    return await Result.findByIds(ids, {
      relations: ['attempt', 'resultAnswers', 'student'],
    })
  }
}
