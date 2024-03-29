import { BadRequestException, Injectable } from '@nestjs/common'
import { Teacher } from './teachers.entity'
import { User } from '../users/user.entity'
import { Subject } from '../subject/subject.entity'
import { TeacherInfoInterface } from './interfaces/teacherInfo.interface'
import { sumBy } from 'lodash'
import { Task } from '../tasks/task.entity'

@Injectable()
export class TeachersService {
  async create(userId: number, subjectId: number): Promise<Teacher> {
    const [user, subject] = await Promise.all([
      User.createQueryBuilder('user')
        .select(['user.id'])
        .where('user.id = :userId', { userId })
        .getOne(),

      Subject.createQueryBuilder('subject')
        .select(['subject.id'])
        .whereInIds(subjectId)
        .getOne(),
    ])

    if (!user) throw new BadRequestException('Користувача не знайдено')
    if (!subject) throw new BadRequestException('Предмет не знайдено')

    try {
      const teacher = await Teacher.create({
        user,
        subject,
      }).save()

      return this.findOne(teacher.id)
    } catch (e) {
      throw new BadRequestException('Викладач вже існує')
    }
  }

  async findOne(teacherId: number): Promise<Teacher> {
    const teacher = await Teacher.createQueryBuilder('teacher')
      .leftJoin('teacher.user', 'user')
      .leftJoin('teacher.subject', 'subject')
      .loadRelationCountAndMap('subject.topicsCount', 'subject.topics')
      .select([
        'teacher.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.email',
        'user.avatar',
        'subject.id',
        'subject.name',
      ])
      .where('teacher.id = :teacherId ', { teacherId })
      .getOne()

    if (!teacher) throw new BadRequestException('Викладача не знайдено')

    return teacher
  }

  async findByUser(user: User): Promise<Teacher[]> {
    return await Teacher.createQueryBuilder('teachers')
      .leftJoin('teachers.subject', 'subject')
      .leftJoin('teachers.user', 'user')
      .leftJoin('teachers.tests', 'test')
      .loadRelationCountAndMap('subject.topicsCount', 'subject.topics')
      .select([
        'teachers.id',
        'subject.id',
        'subject.name',
        'test.id',
        'test.name',
      ])
      .where('user.id = :userId ', { userId: user.id })
      .getMany()
  }

  async findOneByUser(user: User, subject: Subject): Promise<Teacher> {
    const teacher = await Teacher.createQueryBuilder('teachers')
      .leftJoin('teachers.subject', 'subject')
      .leftJoin('teachers.user', 'user')
      .loadRelationCountAndMap('subject.topicsCount', 'subject.topics')
      .select(['teachers.id', 'subject.id', 'subject.name'])
      .where('user.id = :userId ', { userId: user.id })
      .andWhere('subject.id = :subjectId ', { subjectId: subject.id })
      .getOne()

    if (!teacher)
      throw new BadRequestException('Користувач не викладає даний предмет')

    return teacher
  }

  async findEntity(teacherId: number): Promise<Teacher> {
    const teacher = await Teacher.createQueryBuilder('teacher')
      .leftJoin('teacher.user', 'user')
      .leftJoin('teacher.subject', 'subject')
      .leftJoin('teacher.tests', 'tests')
      .leftJoin('user.tasks', 'tasks')
      .select(['teacher.id', 'user.id', 'subject.id'])
      .where('teacher.id = :teacherId ', { teacherId })
      .getOne()

    if (!teacher) throw new BadRequestException('Викладача не знайдено')

    return teacher
  }

  belongsToUser(teacher: Teacher, user: User): boolean {
    return teacher.user.id === user.id
  }

  async getInfo(
    user: User,
    teachers: Teacher[],
  ): Promise<TeacherInfoInterface> {
    return {
      subjectsCount: teachers.length,
      tasksCount: await Task.createQueryBuilder('task')
        .leftJoin('task.creator', 'user')
        .where('user.id = :userId', { userId: user.id })
        .getCount(),
      testsCount: sumBy(teachers, teacher => teacher.tests.length),
    }
  }
}
