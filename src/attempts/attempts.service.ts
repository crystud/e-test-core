import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Attempt } from './attempt.entity'
import { Ticket } from '../tickets/ticket.entity'
import { TicketsService } from '../tickets/tickets.service'
import { TestsService } from '../tests/tests.service'

import { PermissionsService } from '../permissions/permissions.service'
import { Task } from '../tasks/task.entity'

import { ResultAnswer } from './dto/completeAttempt.dto'

import { TasksService } from '../tasks/tasks.service'
import { Test } from '../tests/test.entity'
import { Permission } from '../permissions/permission.entity'
import { AttemptTask } from './attemptTask.entity'
import { AttemptAnswer } from './attemptAnswers.entity'
import { Answer } from '../answers/answer.entity'
import { SchedulerRegistry } from '@nestjs/schedule'
import { TaskType } from '../tasks/enums/TaskType.enum'
import moment = require('moment')

import { ResultsService } from '../results/results.service'

import { getConnection } from 'typeorm'

@Injectable()
export class AttemptsService {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly testsService: TestsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
    private readonly permissionsService: PermissionsService,
    private readonly resultsService: ResultsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(ticket: Ticket): Promise<Attempt> {
    // TODO: add transaction
    if (ticket._used) throw new BadRequestException('Всі спроби вичерпано')
    if (ticket._outstanding) throw new BadRequestException('Час вичерпано')

    let maxScore = 0
    const permission = await this.permissionsService.findEntity(
      ticket.permission.id,
    )

    const test = await this.testsService.findEntity(permission.test.id)

    // TODO: move to another method
    const tasks = await Task.createQueryBuilder('tasks')
      .leftJoin('tasks.tests', 'tests')
      .leftJoin('tasks.topic', 'topic')
      .leftJoin('tasks.answers', 'answers')
      .select(['tasks.id', 'answers.id', 'answers.correct'])
      .where('tests.id = :testId', { testId: test.id })
      .orWhere('topic.id IN (:topicIds)', {
        topicIds: test.topics.map<number>(topic => topic.id),
      })
      .orderBy('RAND()')
      .take(test.countOfTasks)
      .getMany()

    const attempt = this.entityBuilder(test, permission, ticket)
    let attemptTasks = []

    tasks.forEach(task => {
      attemptTasks.push(this.attemptTaskEntityBuilder(task))

      maxScore += this.tasksService.maxScore(task)
    })

    attempt.maxScore = maxScore

    await attempt.save()

    attemptTasks = attemptTasks.map<AttemptTask>(attemptTask => {
      attemptTask.attempt = attempt
      return attemptTask
    })

    await AttemptTask.save(attemptTasks)

    const attemptAnswer = []

    attemptTasks.forEach(attemptTask => {
      attemptTask.task.answers.forEach(answer => {
        attemptAnswer.push(this.attemptAnswerBuilder(answer, attemptTask))
      })
    })

    await AttemptAnswer.save(attemptAnswer)

    const duration = moment(attempt.startTime).diff(moment(attempt.maxEndTime))
    const timeOutHandler = this.timeOutHandleBuilder(attempt)

    const timeout = setTimeout(
      timeOutHandler,
      moment.duration(duration).asMilliseconds(),
    )
    this.schedulerRegistry.addTimeout('test', timeout)

    return await this.findOne(attempt.id)
  }

  async findOne(attemptId: number) {
    const attempt = await Attempt.createQueryBuilder('attempt')
      .leftJoin('attempt.result', 'result')
      .leftJoin('attempt.attemptTasks', 'attemptTasks')
      .leftJoin('attemptTasks.task', 'task')
      .select([
        'attempt.id',
        'attempt.maxScore',
        'attempt.startTime',
        'attempt.endTime',
        'attempt.maxEndTime',
        'attemptTasks.id',
        'task.question',
        'task.type',
        'result.id',
        'result.score',
        'result.percent',
      ])
      .where('attempt.id = :attemptId', { attemptId })
      .getOne()

    if (!attempt) throw new BadRequestException('Спробу не знайдено')

    return attempt
  }

  async findAttemptTask(attemptTaskId: number): Promise<AttemptTask> {
    const attemptTask = await AttemptTask.createQueryBuilder('attemptTask')
      .leftJoin('attemptTask.task', 'task')
      .leftJoin('attemptTask.attemptAnswers', 'attemptAnswers')
      .leftJoin('attemptAnswers.answer', 'answer')
      .select([
        'attemptTask.id',
        'task.question',
        'task.type',
        'task.image',
        'task.attachment',
        'attemptAnswers.id',
        'answer.answerText',
        'answer.image',
      ])
      .where('attemptTask.id = :attemptTaskId', { attemptTaskId })
      .getOne()

    attemptTask.attemptAnswers.forEach(attemptAnswer => {
      if (attemptTask.task.type === TaskType.SHORT_ANSWER)
        attemptAnswer.answer.answerText = undefined
    })

    if (!attemptTask) throw new BadRequestException('Завдання не знайдено')

    return attemptTask
  }

  timeOutHandleBuilder(attempt: Attempt) {
    // TODO: add handler
    return () =>
      global.console.log(`Спроба ${attempt.id} повинна закінчитись зараз`)
  }

  async complete(
    attempt: Attempt,
    resultAnswers: ResultAnswer[],
  ): Promise<Attempt> {
    const attemptTasks = await AttemptTask.createQueryBuilder('attemptTasks')
      .leftJoin('attemptTasks.attempt', 'attempt')
      .leftJoin('attemptTasks.task', 'task')
      .leftJoin('attemptTasks.attemptAnswers', 'attemptAnswers')
      .leftJoin('attemptAnswers.answer', 'answer')
      .select([
        'attemptTasks.id',
        'attemptAnswers.id',
        'task.id',
        'task.type',
        'answer.id',
        'answer.correct',
        'answer.position',
        'answer.answerText',
      ])
      .where('attempt.id = :attemptId', { attemptId: attempt.id })
      .getMany()

    let score = 0
    const resultTasks = []

    attemptTasks.forEach((attemptTask, index) => {
      const result = this.tasksService.checkTask(
        attemptTask.task,
        resultAnswers[index],
        attemptTask,
      )

      resultTasks.push(
        this.resultsService.resultTaskBuilder(
          null,
          attemptTask.task,
          result.correct,
          result.incorrect,
          result.maxScore,
          result.receivedScore,
        ),
      )

      score += result.receivedScore

      return result
    })

    await getConnection().transaction(async transactionalEntityManager => {
      let result = await this.resultsService.entityBuilder(
        attempt,
        score,
        score ? (score / attempt.maxScore) * 100 : 0,
      )

      result = await transactionalEntityManager.save(result)

      resultTasks.forEach(resultTask => (resultTask.result = result))

      await transactionalEntityManager
        .getRepository(Attempt)
        .createQueryBuilder('attempt')
        .update()
        .set({
          endTime: new Date(),
        })
        .where('id = :attemptId', { attemptId: attempt.id })
        .execute()

      await transactionalEntityManager.save(resultTasks)
    })

    return this.findOne(attempt.id)
  }

  entityBuilder(
    test: Test,
    permission: Permission,
    ticket: Ticket,
    maxScore = 0,
  ): Attempt {
    return Attempt.create({
      ticket,
      maxScore,
      maxEndTime: moment()
        .add(test.duration, 'minutes')
        .isAfter(moment(permission.endTime))
        ? moment()
            .add(test.duration, 'minutes')
            .toDate()
        : permission.endTime,
    })
  }
  attemptTaskEntityBuilder(task: Task, attempt?: Attempt): AttemptTask {
    return AttemptTask.create({ task, attempt })
  }

  attemptAnswerBuilder(
    answer: Answer,
    attemptTask?: AttemptTask,
  ): AttemptAnswer {
    return AttemptAnswer.create({ answer, attemptTask })
  }

  maxScore(attemptTask: AttemptTask): number {
    return attemptTask.attemptAnswers.filter(
      attemptTask => attemptTask.answer.correct,
    ).length
  }
}