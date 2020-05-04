import { Injectable } from '@nestjs/common'
import { Ticket } from '../tickets/ticket.entity'

import { Task } from '../tasks/task.entity'
import { AttemptTask } from './attemptTask.entity'
import { AttemptAnswer } from './attemptAnswer.entity'
import { Attempt } from './attempt.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { shuffle } from 'lodash'

import { User } from '../users/user.entity'
import { AccessLevelType } from '../enums/accessLevelType'
import { CompleteAttemptDto } from './dto/completeAttempt.dto'
import { TaskTypes } from '../enums/TaskTypes.enum'
import { ResultAnswer } from '../results/resultAnswer.entity'
import { Result } from '../results/result.entity'
import { AnswerCheckResult } from './interfaces/answerCheckResult.interface'
import { Test } from '../tests/test.entity'

@Injectable()
export class AttemptsService {
  async create(ticket: Ticket) {
    let maxScore = 0
    let attemptTasks = []
    let attemptAnswers = []

    const attempt = await Attempt.create({
      maxScore,
      ticket,
      student: ticket.student,
    }).save()

    for (const level of ticket.permission.test.levels) {
      const countOfTask = level.countOfTask
      const tasks = await Task.createQueryBuilder('task')
        .leftJoinAndSelect('task.levels', 'levels')
        .leftJoinAndSelect('task.answers', 'answers')
        .where('levels.id = :levelsID', { levelsID: level.id })
        .orderBy('RAND()')
        .take(countOfTask)
        .getMany()

      tasks.forEach(task => {
        maxScore += task.maxScore * level.difficult

        attemptTasks = [
          ...attemptTasks,
          AttemptTask.create({
            task,
            level,
            attempt,
          }),
        ]
      })
    }

    attemptTasks = await AttemptTask.save(attemptTasks)

    attemptTasks.forEach(attemptTask => {
      const task = attemptTask.task

      task.answers.forEach(answer => {
        attemptAnswers = [
          ...attemptAnswers,
          AttemptAnswer.create({
            answer,
            attemptTask,
          }),
        ]
      })
    })

    attemptAnswers = shuffle<AttemptAnswer>(attemptAnswers)

    attempt.maxScore = maxScore

    await Promise.all([attempt.save(), AttemptAnswer.save(attemptAnswers)])

    return await this.findOne(attempt.id)
  }

  async findOne(id: number): Promise<Attempt> {
    const attempt = await Attempt.findOne({
      where: {
        id,
      },
      relations: ['ticket', 'student', 'tasks', 'result'],
    })

    if (!attempt) {
      throw new BadRequestExceptionError({
        property: 'attemptId',
        value: id,
        constraints: {
          isNotExist: 'attempt is not exist',
        },
      })
    }

    return attempt
  }

  async isStudent(attempt: Attempt, user: User): Promise<boolean> {
    return attempt.student.id === user.id
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isTeacher(attempt: Attempt, user: User): Promise<boolean> {
    // TODO: refactor
    return false
  }

  async accessRelations(
    attempt: Attempt,
    user: User,
  ): Promise<AccessLevelType[]> {
    const levels: AccessLevelType[] = []

    const [isStudent, isTeacher] = await Promise.all([
      this.isStudent(attempt, user),
      this.isTeacher(attempt, user),
    ])

    if (isStudent) levels.push(AccessLevelType.STUDENT)
    if (isTeacher) levels.push(AccessLevelType.TEACHER)

    return levels
  }

  async findTasks(attempt: Attempt): Promise<AttemptTask[]> {
    return await AttemptTask.find({
      where: {
        attempt,
      },
      relations: [
        'task',
        'task.answers',
        'level',
        'attempt',
        'attemptAnswers',
        'attemptAnswers.answer',
      ],
    })
  }

  async findTask(id: number): Promise<AttemptTask> {
    const attemptTask = await AttemptTask.findOne({
      where: {
        id,
      },
      relations: ['task', 'level', 'attempt', 'attemptAnswers'],
    })

    if (!attemptTask) {
      throw new BadRequestExceptionError({
        property: 'attemptTaskId',
        value: id,
        constraints: {
          isNotExist: 'attemptTask is not exist',
        },
      })
    }

    return attemptTask
  }

  async findAnswers(attemptTask: AttemptTask): Promise<AttemptAnswer[]> {
    return await AttemptAnswer.find({
      where: {
        attemptTask,
      },
      relations: ['answer', 'attemptTask'],
    })
  }

  async findAnswer(id: number): Promise<AttemptAnswer> {
    const attemptAnswer = await AttemptAnswer.findOne({
      where: {
        id,
      },
      relations: ['answer', 'attemptTask'],
    })

    if (!attemptAnswer) {
      throw new BadRequestExceptionError({
        property: 'attemptAnswerId',
        value: id,
        constraints: {
          isNotExist: 'attemptAnswer is not exist',
        },
      })
    }

    return attemptAnswer
  }

  private checkSingleChoice(
    answers: number[],
    attemptAnswers: AttemptAnswer[],
  ): AnswerCheckResult {
    const [answer] = answers

    if (answer === undefined || typeof answers === 'string')
      return { correct: [], inrcorect: [] }

    const result: AnswerCheckResult = {
      correct: [],
      inrcorect: [],
    }

    const attemptAnswer = attemptAnswers.find(value => value.id === answer)

    if (!attemptAnswer) {
      return result
    }

    attemptAnswer.answer.correct
      ? result.correct.push(attemptAnswer.answer.text)
      : result.inrcorect.push(attemptAnswer.answer.text)

    return result
  }

  private checkMultyChoice(
    answers: number[],
    attemptAnswers: AttemptAnswer[],
  ): AnswerCheckResult {
    const result: AnswerCheckResult = {
      correct: [],
      inrcorect: [],
    }

    attemptAnswers
      .filter(value => value.answer.correct)
      .forEach(value => {
        if (answers.includes(value.id)) {
          result.correct.push(value.answer.text)
        }
      })

    attemptAnswers
      .filter(value => !value.answer.correct)
      .forEach(value => {
        if (answers.includes(value.id)) {
          result.inrcorect.push(value.answer.text)
        }
      })

    return result
  }

  private checkTextInput(
    answer: string,
    attemptAnswers: AttemptAnswer[],
    ignoreCase: boolean,
  ): AnswerCheckResult {
    const result: AnswerCheckResult = {
      correct: [],
      inrcorect: [],
    }

    if (ignoreCase) answer = answer.toLowerCase()

    let text

    const isCorrect = attemptAnswers.some(value => {
      text = value.answer.text

      if (ignoreCase) {
        text = text.toLowerCase()
      }

      return text === answer
    })

    isCorrect ? result.correct.push(answer) : result.inrcorect.push(answer)

    return result
  }

  async complete(
    completeAttemptDto: CompleteAttemptDto,
    attempt: Attempt,
  ): Promise<Result> {
    // TODO: refactor structure
    const resultTasks = completeAttemptDto.tasks
    const tasks = await this.findTasks(attempt)

    if (resultTasks.length !== tasks.length)
      throw new BadRequestExceptionError({
        property: 'tasks.length',
        value: tasks.length,
        constraints: {
          countOfTasks: 'You must sand all answers',
        },
      })

    // TODO: refactor
    const test = await Test.createQueryBuilder('test')
      .leftJoin('test.permissions', 'permissions')
      .leftJoin('permissions.tickets', 'tickets')
      .leftJoin('tickets.attempts', 'attempts')
      .select(['test.id'])
      .where('attempts.id = :attemptsId', { attemptsId: attempt.id })
      .getOne()

    const reportResult = await Result.create({
      resultScore: 0,
      persents: 0,
      test,
      student: attempt.student,
    })

    await reportResult.save()

    const reportResultAnswers: ResultAnswer[] = []
    let fullScore = 0

    resultTasks.forEach((resultTask, index) => {
      const resultAnswers = resultTask.answers
      const attemptTask = tasks[index]
      const task = attemptTask.task
      let result: AnswerCheckResult

      let taskScore = 0

      switch (task.type) {
        case TaskTypes.SINGLE_CHOICE:
          if (typeof resultAnswers === 'string') break

          result = this.checkSingleChoice(
            resultAnswers,
            attemptTask.attemptAnswers,
          )

          taskScore = result.correct.length * attemptTask.level.difficult

          break

        case TaskTypes.MULTY_CHOICE:
          if (typeof resultAnswers === 'string') {
            result = {
              correct: [],
              inrcorect: task.answers
                .filter(answer => !answer.correct)
                .map(answer => answer.text),
            }

            taskScore =
              -1 * result.inrcorect.length * attemptTask.level.difficult

            break
          }

          result = this.checkMultyChoice(
            resultAnswers,
            attemptTask.attemptAnswers,
          )

          taskScore =
            (result.correct.length - result.inrcorect.length) *
            attemptTask.level.difficult

          break

        case TaskTypes.TEXT_INPUT:
          if (typeof resultAnswers !== 'string') {
            result = {
              correct: [],
              inrcorect: [],
            }

            taskScore = 0

            break
          }

          result = this.checkTextInput(
            resultAnswers,
            attemptTask.attemptAnswers,
            attemptTask.task.ignoreCase,
          )

          taskScore = result.correct.length * attemptTask.level.difficult

          break
      }

      reportResultAnswers.push(
        ResultAnswer.create({
          retrievedScore: taskScore,
          correctAnswers: result.correct,
          incorrectAnswers: result.inrcorect,
          result: reportResult,
          possibleScore: task.maxScore,
        }),
      )

      fullScore += taskScore
    })

    reportResult.persents = (fullScore / attempt.maxScore) * 100
    reportResult.resultScore = fullScore

    attempt.endTime = new Date()
    attempt.result = reportResult

    const [report] = await Promise.all([
      reportResult.save(),
      ResultAnswer.save(reportResultAnswers),
      attempt.save(),
    ])

    return report
  }
}
