import { BadRequestException, Injectable } from '@nestjs/common'
import { Task } from './task.entity'
import { Topic } from '../topics/topic.entity'

import { TaskType } from './enums/TaskType.enum'
import { User } from '../users/user.entity'

@Injectable()
export class TasksService {
  async create(
    question: string,
    image: string | null = null,
    type: TaskType,
    attachment: string | null = null,
    topic: Topic,
    creator: User,
  ): Promise<Task> {
    const task = await Task.create({
      question,
      image,
      type,
      attachment,
      topic,
      creator,
    }).save()

    return this.findOne(task.id)
  }

  async findOne(taskId: number): Promise<Task> {
    const task = await Task.createQueryBuilder('task')
      .leftJoin('task.topic', 'topic')
      .leftJoin('task.answers', 'answers')
      .leftJoin('task.creator', 'creator')
      .select([
        'task.id',
        'task.question',
        'task.image',
        'task.type',
        'task.attachment',
        'topic.id',
        'topic.name',
        'creator.id',
        'creator.firstName',
        'creator.lastName',
        'creator.patronymic',
        'answers.id',
        'answers.answerText',
        'answers.correct',
        'answers.position',
        'answers.image',
      ])
      .where('task.id = :taskId ', { taskId })
      .orderBy({
        'answers.position': 'ASC',
      })
      .getOne()

    if (!task) throw new BadRequestException('Завдання не знайдено')

    return task
  }

  async findEntity(taskId: number): Promise<Task> {
    const task = await Task.createQueryBuilder('task')
      .leftJoin('task.answers', 'answers')
      .select(['task.id', 'task.type', 'answers.id', 'answers.position'])
      .where('task.id = :taskId ', { taskId })
      .getOne()

    if (!task) throw new BadRequestException('Завдаггя не знайдено')

    return task
  }

  maxScore(task: Task): number {
    return task.answers.filter(answer => answer.correct).length
  }
}
