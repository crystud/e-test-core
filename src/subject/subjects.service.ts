import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'
import { User } from '../users/user.entity'

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await Subject.create({ ...createSubjectDto }).save()
  }

  async findOne(subjectId: number): Promise<Subject> {
    return await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .leftJoin('subject.topics', 'topics')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'teachers.firstName',
        'teachers.lastName',
        'teachers.patronymic',
        'teachers.email',
        'topics.id',
        'topics.name',
      ])
      .where('subject.id = :subjectId ', { subjectId })
      .getOne()
  }

  async findAll(subjectName: string): Promise<Subject[]> {
    return await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .leftJoin('subject.topics', 'topics')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'teachers.firstName',
        'teachers.lastName',
        'teachers.patronymic',
        'teachers.email',
        'topics.id',
        'topics.name',
      ])
      .where('subject.name like :name ', {
        name: `%${subjectName}%`,
      })
      .getMany()
  }

  async addTeacher(subjectId: number, userId: number): Promise<Subject> {
    const subject = await this.findOne(subjectId)

    if (subject.teachers.some(teacher => teacher.id === Number(userId)))
      throw new BadRequestException('Користувач вже викладає даний предмет')

    subject.teachers.push(User.create({ id: userId }))

    await subject.save()

    return await this.findOne(subjectId)
  }
}
