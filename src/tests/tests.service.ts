import { Injectable } from '@nestjs/common'
import { CreateTestDto } from './dto/createTest.dto'
import { User } from '../users/user.entity'
import { Test } from './test.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Subject } from '../subjects/subject.entity'
import { UsersService } from '../users/users.service'
import { College } from '../colleges/college.entity'

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
      relations: ['creator', 'levels', 'levels.tasks', 'subject', 'colleges'],
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

  isShared(test: Test, college: College): boolean {
    return test.colleges.some(value => value.id === college.id)
  }

  async shareToCollage(test: Test, college: College): Promise<Test> {
    if (this.isShared(test, college)) {
      test.colleges.push(college)
      await test.save()
    }

    return test
  }

  hasAccess(test: Test, user: User): boolean {
    return this.usersService.isAdmin(user) || this.isCreator(test, user)
  }

  isCreator(test: Test, user: User): boolean {
    return test.creator.id === user.id
  }
}
