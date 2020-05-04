import { Injectable } from '@nestjs/common'

import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await Subject.create({ ...createSubjectDto }).save()
  }

  async findOne(subjectId: number): Promise<Subject> {
    return await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'teachers.firstName',
        'teachers.lastName',
        'teachers.patronymic',
        'teachers.email',
      ])
      .where('subject.id = :subjectId ', { subjectId })
      .getOne()
  }

  async findAll(subjectName: string): Promise<Subject[]> {
    return await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'teachers.firstName',
        'teachers.lastName',
        'teachers.patronymic',
        'teachers.email',
      ])
      .where('subject.name like :name ', {
        name: `%${subjectName}%`,
      })
      .getMany()
  }
}
