import { BadRequestException, Injectable } from '@nestjs/common'

import { User } from '../users/user.entity'

import { Student } from './student.entity'
import { Group } from '../groups/group.entity'

@Injectable()
export class StudentsService {
  // TODO: refactor
  async create(
    userId: number,
    groupId: number,
    scoringBook: number,
  ): Promise<Student> {
    const [user, group] = await Promise.all([
      User.createQueryBuilder('user')
        .select(['user.id'])
        .whereInIds(userId)
        .getOne(),

      Group.createQueryBuilder('group')
        .select(['group.id'])
        .whereInIds(groupId)
        .getOne(),
    ])

    if (!user) throw new BadRequestException('Користувача не знайдено')
    if (!group) throw new BadRequestException('Групу не знайдено')

    try {
      const teacher = await Student.create({
        user,
        group,
        scoringBook,
      }).save()

      return this.findOne(teacher.id)
    } catch (e) {
      throw new BadRequestException('Студент вже існує')
    }
  }

  async findOne(studentId: number): Promise<Student> {
    const student = await Student.createQueryBuilder('student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .leftJoin('student.invite', 'invite')
      .leftJoin('invite.creator', 'creator')
      .select([
        'student.id',
        'student.scoringBook',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.email',
        'user.avatar',
        'group.id',
        'group.startYear',
        'group.number',
        'group.active',
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'invite.id',
        'invite.createAt',
        'invite.usedAt',
        'invite.code',
        'creator.id',
        'creator.firstName',
        'creator.lastName',
        'creator.patronymic',
        'creator.email',
      ])
      .whereInIds(studentId)
      .getOne()

    if (!student) throw new BadRequestException('Студента не знайдено')

    return student
  }

  async findEntity(studentId: number): Promise<Student> {
    const student = await Student.createQueryBuilder('student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.group', 'group')
      .select(['student.id', 'student.scoringBook', 'user.id', 'group.id'])
      .where('student.id = :studentId', { studentId })
      .getOne()

    if (!student) throw new BadRequestException('Студента не знайдено')

    return student
  }

  async hasAccess(user: User, student: Student): Promise<boolean> {
    return student.user.id === user.id
  }

  async findByUser(user: User): Promise<Student[]> {
    return await Student.createQueryBuilder('students')
      .leftJoin('students.user', 'user')
      .leftJoin('students.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'students.id',
        'students.scoringBook',
        'group.id',
        'group.startYear',
        'group.number',
        'group.active',
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .where('user.id = :userId', { userId: user.id })
      .getMany()
  }
}
