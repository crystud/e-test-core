import { Injectable } from '@nestjs/common'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { FilterSubjectDto } from './dto/filterSubject.dto'
import { User } from '../users/user.entity'
import { dbStringLikeBuilder } from '../tools/dbRequestBuilers/dbStringLike.builder'

@Injectable()
export class SubjectsService {
  async create(
    createSubjectDto: CreateSubjectDto,
    user: User,
  ): Promise<Subject> {
    try {
      const subject = await Subject.create({
        ...createSubjectDto,
        creator: user,
      }).save()

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
      relations: ['teachers', 'colleges', 'topics', 'creator'],
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

  async findAll(
    filterSubjectDto: FilterSubjectDto,
    like = true,
  ): Promise<Subject[]> {
    const filter = like
      ? dbStringLikeBuilder(filterSubjectDto)
      : filterSubjectDto

    return await Subject.find({
      where: {
        ...filter,
      },
      relations: ['teachers', 'colleges', 'topics', 'creator'],
    })
  }

  async confirm(id: number): Promise<Subject> {
    await Subject.update(
      {
        id,
      },
      {
        confirmed: true,
      },
    )

    return await this.findOne(id)
  }
}
