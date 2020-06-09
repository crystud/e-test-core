import { BadRequestException, Injectable } from '@nestjs/common'
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
        if (
          task.type === TaskType.SIMPLE_CHOICE &&
          task.answers.some(answer => answer.correct)
        ) {
          await transactionalEntityManager
            .getRepository(Task)
            .createQueryBuilder('task')
            .update()
            .set({
              type: TaskType.MULTIPLE_CHOICE,
            })
            .where('task.id = :taskId', { taskId: task.id })
            .execute()
        }

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

    return await this.findOne(answer.id)
  }

  async findOne(answerId: number): Promise<Answer> {
    const answer = await Answer.createQueryBuilder('answer')
      .leftJoin('answer.task', 'task')
      .select([
        'answer.id',
        'answer.answerText',
        'answer.correct',
        'answer.position',
        'answer.image',
        'task.id',
        'task.type',
      ])
      .where('answer.id = :answerId', { answerId })
      .getOne()

    if (!answer) throw new BadRequestException('Відповідь не знайдено')

    return answer
  }

  countOfAnswers(task: Task): number {
    return task.answers.length
  }
}
