import { Injectable } from '@nestjs/common'
import { Study } from './study.entity'
import { Subject } from '../subjects/subject.entity'
import { College } from '../colleges/college.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

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
}
