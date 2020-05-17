import { BadRequestException, Injectable } from '@nestjs/common'
import { Teacher } from './teachers.entity'
import { User } from '../users/user.entity'
import { Subject } from '../subject/subject.entity'

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
      .select([
        'teacher.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.email',
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
      .select(['teachers.id', 'subject.id', 'subject.name'])
      .where('user.id = :userId ', { userId: user.id })
      .getMany()
  }

  async findEntity(teacherId: number): Promise<Teacher> {
    const teacher = await Teacher.createQueryBuilder('teacher')
      .leftJoin('teacher.user', 'user')
      .leftJoin('teacher.subject', 'subject')
      .select(['teacher.id', 'user.id', 'subject.id'])
      .where('teacher.id = :teacherId ', { teacherId })
      .getOne()

    if (!teacher) throw new BadRequestException('Викладача не знайдено')

    return teacher
  }

  belongsToUser(teacher: Teacher, user: User): boolean {
    return teacher.user.id === user.id
  }
}
