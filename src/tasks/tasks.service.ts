import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Task } from './task.entity'
import { Topic } from '../topics/topic.entity'

import { TaskType } from './enums/TaskType.enum'
import { User } from '../users/user.entity'
import { ResultAnswer } from '../attempts/dto/completeAttempt.dto'
import { AttemptTask } from '../attempts/attemptTask.entity'
import { TaskResultInterface } from '../results/interfaces/taskResult.interface'

import { AttemptsService } from '../attempts/attempts.service'

@Injectable()
export class TasksService {
  constructor(
    @Inject(forwardRef(() => AttemptsService))
    private readonly attemptsService: AttemptsService,
  ) {}

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
    switch (task.type) {
      case TaskType.SIMPLE_CHOICE:
        return 1

      case TaskType.NUMERICAL:
        return task.answers.length

      case TaskType.SHORT_ANSWER:
        return 1

      case TaskType.MULTIPLE_CHOICE:
        return task.answers.filter(answer => answer.correct).length
    }
  }

  checkTask(
    task: Task,
    resultAnswer: ResultAnswer,
    attemptTask: AttemptTask,
  ): TaskResultInterface {
    switch (task.type) {
      case TaskType.SIMPLE_CHOICE:
        return this.checkSimpleChoice(resultAnswer, attemptTask)
      case TaskType.MULTIPLE_CHOICE:
        return this.checkMultipleChoice(resultAnswer, attemptTask)
      case TaskType.SHORT_ANSWER:
        return this.checkShortAnswer(resultAnswer, attemptTask)
      case TaskType.NUMERICAL:
        return this.checkNumerical(resultAnswer, attemptTask)
    }
  }

  checkSimpleChoice(
    resultAnswer: ResultAnswer,
    attemptTask: AttemptTask,
  ): TaskResultInterface {
    const correct = []
    const incorrect = []

    if (Array.isArray(resultAnswer.answers) && resultAnswer.answers.length) {
      const attemptAnswer = attemptTask.attemptAnswers.find(
        attemptAnswer => attemptAnswer.id === resultAnswer.answers[0],
      )

      if (!attemptAnswer)
        throw new BadRequestException(
          'В даного запитання немає такої відповіді',
        )

      if (attemptAnswer.answer.correct) {
        correct.push(attemptAnswer.answer.answerText)
      } else {
        incorrect.push(attemptAnswer.answer.answerText)
      }
    }

    return {
      correct,
      incorrect,
      maxScore: 1,
      receivedScore: correct.length,
    }
  }

  checkMultipleChoice(
    resultAnswer: ResultAnswer,
    attemptTask: AttemptTask,
  ): TaskResultInterface {
    const maxScore = this.attemptsService.maxScore(attemptTask)
    const correct = []
    const incorrect = []

    // TODO: fix facking ts. I said that resultAnswer.answers is array... No you must check it again
    if (Array.isArray(resultAnswer.answers) && resultAnswer.answers.length) {
      const answers = resultAnswer.answers

      const attemptAnswers = attemptTask.attemptAnswers.filter(attemptAnswer =>
        answers.includes(attemptAnswer.id),
      )

      attemptAnswers.forEach(attemptAnswer => {
        if (attemptAnswer.answer.correct) {
          correct.push(attemptAnswer.answer.answerText)
        } else {
          incorrect.push(attemptAnswer.answer.answerText)
        }
      })
    }

    return {
      correct,
      incorrect,
      maxScore,
      receivedScore: correct.length - incorrect.length,
    }
  }

  checkShortAnswer(
    resultAnswer: ResultAnswer,
    attemptTask: AttemptTask,
  ): TaskResultInterface {
    const correct = []
    const incorrect = []

    if (typeof resultAnswer.answers === 'string') {
      const isCorrect = attemptTask.attemptAnswers.some(
        attemptAnswer =>
          attemptAnswer.answer.answerText === resultAnswer.answers,
      )

      if (isCorrect) {
        correct.push(resultAnswer.answers)
      } else {
        incorrect.push(resultAnswer.answers)
      }
    }

    return {
      correct,
      incorrect,
      maxScore: 1,
      receivedScore: correct.length,
    }
  }

  checkNumerical(
    resultAnswer: ResultAnswer,
    attemptTask: AttemptTask,
  ): TaskResultInterface {
    const correct = []
    const incorrect = []

    if (
      Array.isArray(resultAnswer.answers) &&
      resultAnswer.answers?.length === attemptTask.attemptAnswers.length
    ) {
      attemptTask.attemptAnswers = attemptTask.attemptAnswers.sort(
        (a, b) => a.answer.position - b.answer.position,
      )

      const answers = resultAnswer.answers

      attemptTask.attemptAnswers.forEach((attemptAnswer, index) => {
        if (attemptAnswer.id === answers[index]) {
          correct.push(`#${index} ${attemptAnswer.answer.answerText}`)
        } else {
          incorrect.push(`#${index} ${attemptAnswer.answer.answerText}`)
        }
      })
    }

    return {
      correct,
      incorrect,
      maxScore: attemptTask.attemptAnswers.length,
      receivedScore: correct.length,
    }
  }
}
