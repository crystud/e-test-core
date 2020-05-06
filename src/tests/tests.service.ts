import { BadRequestException, Injectable } from '@nestjs/common'
import { Test } from './test.entity'
import { Teacher } from '../teachers/teachers.entity'

@Injectable()
export class TestsService {
  async create(name: string, teacher: Teacher): Promise<Test> {
    const test = await Test.create({
      name,
      creator: teacher,
    }).save()

    return await this.findOne(test.id)
  }

  async findOne(testId: number): Promise<Test> {
    const test = await Test.createQueryBuilder('test')
      .leftJoin('test.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .select([
        'test.id',
        'test.name',
        'creator.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
      ])
      .where('test.id = :testId', { testId })
      .getOne()

    if (!test) throw new BadRequestException('Тест не знайдено')

    return test
  }

  async findByTeacher(teacher: Teacher): Promise<Test[]> {
    return await Test.createQueryBuilder('test')
      .leftJoin('test.creator', 'creator')
      .leftJoin('creator.user', 'user')
      .select([
        'test.id',
        'test.name',
        'creator.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
      ])
      .where('creator.id = :creatorId', { creatorId: teacher.id })
      .getMany()
  }
}
