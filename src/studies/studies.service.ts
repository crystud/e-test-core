import { Injectable } from '@nestjs/common'
import { Study } from './study.entity'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { User } from '../users/user.entity'
import { Test } from '../tests/test.entity'

@Injectable()
export class StudiesService {
  async create(college: College, subject: Subject): Promise<Study> {
    try {
      const study = await Study.create({
        college,
        subject,
      }).save()

      return await this.findOne(study.id)
    } catch (e) {
      if (e.name === 'QueryFailedError' && e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestExceptionError({
          property: 'field',
          value: '',
          constraints: {
            duplicate: e.message,
          },
        })
      }
    }
  }

  async findOne(id: number): Promise<Study> {
    const study = await Study.findOne({
      where: {
        id,
      },
      relations: ['college', 'specialties', 'subject', 'teachers'],
    })

    if (!study) {
      throw new BadRequestExceptionError({
        property: 'studyId',
        value: id,
        constraints: {
          isNotExist: 'study is not exist',
        },
      })
    }

    return study
  }

  public isTeacher(study: Study, teacher: User): boolean {
    return study.teachers.some(value => value.id == teacher.id)
  }

  async addTeacher(study: Study, teacher: User): Promise<Study> {
    if (this.isTeacher(study, teacher)) {
      throw new BadRequestExceptionError({
        property: 'teacherId',
        value: teacher.id,
        constraints: {
          isNotExist: 'Cannon add teacher who already is in the study',
        },
      })
    }

    return study
  }

  hasTest(study: Study, test: Test): boolean {
    return study.tests.some(value => value.id === test.id)
  }

  async addTest(study: Study, test: Test): Promise<Study> {
    if (this.hasTest(study, test)) {
      throw new BadRequestExceptionError({
        property: 'testId',
        value: test.id,
        constraints: {
          isNotExist: 'Cannon add test which already is in the study',
        },
      })
    }

    study.tests.push(test)

    await study.save()

    return study
  }
}
