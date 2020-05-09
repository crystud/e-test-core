import { BadRequestException, Injectable } from '@nestjs/common'

import { User } from '../users/user.entity'

import { Student } from './student.entity'
import { Group } from '../groups/group.entity'

@Injectable()
export class StudentsService {
  async create(
    userId: number,
    groupId: number,
    scoringBook: number,
  ): Promise<Student> {
    const [user, group] = await Promise.all([
      User.createQueryBuilder('user')
        .select(['user.id', 'user.roles'])
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

      await user.save()

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
      .select([
        'student.id',
        'student.scoringBook',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.email',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .whereInIds(studentId)
      .getOne()

    if (!student) throw new BadRequestException('Студента не знайдено')

    return student
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