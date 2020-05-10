import { Injectable } from '@nestjs/common'
import { Answer } from './answer.entity'
import { Task } from '../tasks/task.entity'
import { getManager } from 'typeorm'
import { TaskType } from '../tasks/enums/TaskType.enum'

@Injectable()
export class AnswersService {
  async create(
    answerText: string,
    correct: boolean,
    position: number = null,
    image: string = null,
    task: Task,
  ): Promise<Answer> {
    if (task.type === TaskType.NUMERICAL) {
      const countOfAnswers = this.countOfAnswers(task)

      if (position === null) position = countOfAnswers + 1
      else if (countOfAnswers < position) position = countOfAnswers + 1
    } else {
      position = null
    }

    let answer = await Answer.create({
      answerText,
      correct,
      position,
      image,
      task,
    })

    await getManager().transaction(
      'READ COMMITTED',
      async transactionalEntityManager => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Answer)
          .set({ position: () => 'position + 1' })
          .where('position >= :position', { position })
          .andWhere('task_id = :taskId', { taskId: task.id })
          .execute()

        answer = await transactionalEntityManager.save(answer)
      },
    )

    return answer
  }

  countOfAnswers(task: Task): number {
    return task.answers.length
  }
}
