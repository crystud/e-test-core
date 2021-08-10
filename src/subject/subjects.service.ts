import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'
import { Speciality } from '../specialties/speciality.entity'

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await Subject.create({ ...createSubjectDto }).save()
  }

  async findOne(subjectId: number): Promise<Subject> {
    const subject = await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .leftJoin('teachers.user', 'user')
      .leftJoin('subject.topics', 'topics')
      .leftJoin('subject.specialties', 'specialties')
      .leftJoin('specialties.groups', 'groups')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.email',
        'specialties.id',
        'specialties.name',
        'specialties.symbol',
        'specialties.yearOfStudy',
        'specialties.code',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'topics.id',
        'topics.name',
      ])
      .where('subject.id = :subjectId ', { subjectId })
      .getOne()

    if (!subject) throw new BadRequestException('Предмет не знайдено')

    subject.specialties.forEach(specialty => {
      specialty.groups.forEach(group => {
        group.speciality = Speciality.create()
        group.speciality.symbol = specialty.symbol
        group.speciality.yearOfStudy = specialty.yearOfStudy
      })
    })

    return subject
  }

  async findAll(
    subjectName = '',
    specialtiesIds: number[] = [],
  ): Promise<Subject[]> {
    const subjectsQueryBuilder = Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .leftJoin('teachers.user', 'user')
      .leftJoin('subject.topics', 'topics')
      .leftJoin('subject.specialties', 'specialties')
      .select([
        'subject.id',
        'subject.name',
        'teachers.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'specialties.id',
        'specialties.name',
        'specialties.symbol',
        'specialties.yearOfStudy',
        'specialties.code',
        'topics.id',
        'topics.name',
      ])
      .where('subject.name like :name ', {
        name: `%${subjectName}%`,
      })

    if (specialtiesIds.length) {
      subjectsQueryBuilder.where('specialties.id IN (:specialtiesIds)', {
        specialtiesIds,
      })
    }

    return await subjectsQueryBuilder.getMany()
  }

  async findEntity(subjectId: number): Promise<Subject> {
    const subject = await Subject.createQueryBuilder('subject')
      .leftJoin('subject.teachers', 'teachers')
      .leftJoin('subject.specialties', 'specialties')
      .select(['subject.id', 'subject.name', 'teachers.id', 'specialties.id'])
      .where('subject.id = :subjectId ', { subjectId })
      .getOne()

    if (!subject) throw new BadRequestException('Предмет не знайдено')

    return subject
  }
}
