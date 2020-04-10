import { Injectable } from '@nestjs/common'
import { CreateTestDto } from './dto/createTest.dto'
import { User } from '../users/user.entity'
import { Test } from './test.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { College } from '../colleges/college.entity'
import { Subject } from '../subjects/subject.entity'

@Injectable()
export class TestsService {
  async create(
    createTestDto: CreateTestDto,
    subject: Subject,
    creator: User,
  ): Promise<Test> {
    try {
      const test = await Test.create({
        ...createTestDto,
        creator,
        subject,
      }).save()

      return await this.findOne(test.id)
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

  async findOne(id: number) {
    const test = await Test.findOne({
      where: {
        id,
      },
      relations: ['levels', 'creator', 'results'],
    })

    if (!test) {
      throw new BadRequestExceptionError({
        property: 'testId',
        value: id,
        constraints: {
          isNotExist: 'test is not exist',
        },
      })
    }

    return test
  }
}
