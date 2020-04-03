import { Injectable } from '@nestjs/common'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
      const subject = await Subject.create(createSubjectDto).save()

      return await this.findOne(subject.id)
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

  async findOne(id: number): Promise<Subject> {
    const subject = await Subject.findOne({
      where: {
        id,
      },
      relations: ['teachers', 'colleges', 'specialties'],
    })

    if (!subject) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'subject is not exist',
        },
      })
    }

    return subject
  }
}
