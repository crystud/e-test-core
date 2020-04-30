import { Injectable } from '@nestjs/common'
import { Ticket } from '../tickets/ticket.entity'

import { Task } from '../tasks/task.entity'
import { AttemptTask } from './attemptTask.entity'
import { AttemptAnswer } from './attemptAnswer.entity'
import { Attempt } from './attempt.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { shuffle } from 'lodash'
import { College } from '../colleges/college.entity'
import { User } from '../users/user.entity'
import { AccessLevelType } from '../enums/accessLevelType'

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
        .limit(countOfTask)
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

    attemptAnswers = await AttemptAnswer.save(attemptAnswers)

    return await this.findOne(attempt.id)
  }

  async findOne(id: number): Promise<Attempt> {
    const attempt = await Attempt.findOne({
      where: {
        id,
      },
      relations: ['ticket', 'student', 'tasks'],
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
}
