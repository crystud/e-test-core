import { BadRequestException, Injectable } from '@nestjs/common'
import { Test } from './test.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Task } from '../tasks/task.entity'
import { Topic } from '../topics/topic.entity'
import { TestStatusInterface } from './interfaces/TestStatus.interface'

@Injectable()
export class TestsService {
  async create(
    name: string,
    countOfTasks: number,
    duration: number,
    teacher: Teacher,
  ): Promise<Test> {
    const test = await Test.create({
      name,
      countOfTasks,
      duration,
      creator: teacher,
      subject: teacher.subject,
    }).save()

    return await this.findOne(test.id)
  }

  async findOne(testId: number): Promise<Test> {
    const test = await Test.createQueryBuilder('test')
      .leftJoin('test.creator', 'creator')
      .leftJoin('test.subject', 'subject')
      .leftJoin('creator.user', 'user')
      .leftJoin('test.tasks', 'tasks')
      .leftJoin('test.topics', 'topics')
      .select([
        'test.id',
        'test.name',
        'test.duration',
        'creator.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'subject.id',
        'subject.name',
        'topics.id',
        'topics.name',
        'tasks.id',
        'tasks.type',
        'tasks.question',
      ])
      .where('test.id = :testId', { testId })
      .getOne()

    if (!test) throw new BadRequestException('Тест не знайдено')

    return test
  }

  async findByTeacher(teacher: Teacher): Promise<Test[]> {
    return await Test.createQueryBuilder('test')
      .leftJoin('test.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .leftJoin('test.tasks', 'tasks')
      .leftJoin('test.topics', 'topics')
      .select([
        'test.id',
        'test.name',
        'test.duration',
        'creator.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'tasks.id',
        'topics.id',
        'topics.name',
      ])
      .where('creator.id = :creatorId', { creatorId: teacher.id })
      .getMany()
  }

  async findEntity(testId: number): Promise<Test> {
    const test = await Test.createQueryBuilder('test')
      .leftJoin('test.creator', 'creator')
      .leftJoin('test.tasks', 'tasks')
      .leftJoin('test.topics', 'topics')
      .select([
        'test.id',
        'test.countOfTasks',
        'test.duration',
        'tasks.id',
        'topics.id',
        'creator.id',
      ])
      .where('test.id = :testId ', { testId })
      .getOne()

    if (!test) throw new BadRequestException('Тест не знайдено')

    return test
  }

  async addTask(test: Test, task: Task): Promise<Test> {
    test.tasks.push(task)
    await test.save()

    return this.findOne(test.id)
  }

  async addTopic(test: Test, topic: Topic): Promise<Test> {
    test.topics.push(topic)
    await test.save()

    return this.findOne(test.id)
  }

  async status(test: Test): Promise<TestStatusInterface> {
    const tasks = await Task.createQueryBuilder('tasks')
      .leftJoin('tasks.tests', 'tests')
      .select(['tasks.id'])
      .where('tests.id = :testId', { testId: test.id })
      .getMany()

    const topicsTasks = await Task.createQueryBuilder('tasks')
      .leftJoin('tasks.topic', 'topic')
      .leftJoin('topic.tests', 'tests')
      .select(['tasks.id'])
      .where('tests.id = :testId', { testId: test.id })
      .where('tasks.id NOT IN (:tasksIds)', {
        tasksIds: tasks.map<number>(task => task.id),
      })
      .getMany()

    const tasksCount = tasks.length
    const topicsTasksCount = topicsTasks.length

    return {
      tasksCount,
      topicsTasksCount,
      completed: tasksCount + tasksCount >= test.countOfTasks,
    }
  }
}
