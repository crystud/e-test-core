import { Injectable } from '@nestjs/common'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { Subject } from './subject.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Like } from 'typeorm'
import { FilterSubjectDto } from './dto/filterSubject.dto'
import { User } from '../users/user.entity'

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
      relations: ['teachers', 'colleges'],
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
    // TODO: refactor
    const filter: { [k: string]: any } = {}

    for (const filterItem in filterSubjectDto) {
      if (
        like &&
        typeof filterSubjectDto[filterItem] === 'string' &&
        (filterSubjectDto[filterItem] != 'false' ||
          filterSubjectDto[filterItem] != 'true')
      ) {
        filter[filterItem] = Like(`%${filterSubjectDto[filterItem]}%`)
      } else {
        filter[filterItem] = filterSubjectDto[filterItem]
      }
    }

    return await Subject.find({
      where: {
        ...filter,
      },
      relations: ['teachers', 'colleges'],
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
