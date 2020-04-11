import { Injectable } from '@nestjs/common'
import { CreateTestDto } from './dto/createTest.dto'
import { User } from '../users/user.entity'
import { Test } from './test.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Subject } from '../subjects/subject.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class TestsService {
  constructor(private readonly usersService: UsersService) {}

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

  hasAccess(test: Test, user: User) {
    return this.usersService.isAdmin(user) || this.isCreator(test, user)
  }

  isCreator(test: Test, user: User): boolean {
    return test.creator.id === user.id
  }
}
