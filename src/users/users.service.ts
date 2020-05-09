import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { hash } from 'bcryptjs'
import { classToClass } from 'class-transformer'

import { FilterUserDto } from './dto/filterUser.dto'

import { ConfigService } from '@nestjs/config'

import { dbStringLikeBuilder } from '../tools/dbRequestBuilders/dbStringLike.builder'

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  async findOne(id: number): Promise<User> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.students', 'students')
      .leftJoin('user.teachers', 'teachers')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.patronymic',
        'user.firstName',
        'user.email',
        'user.createAt',
        'students.id',
        'students.scoringBook',
        'teachers.id',
      ])
      .where('user.id = :userId', { userId: id })
      .getOne()

    if (!user) throw new BadRequestException('користувача з таки id не існує')

    return user
  }

  async findAll(filterUserDto: FilterUserDto, like = true): Promise<User[]> {
    const filter = like ? dbStringLikeBuilder(filterUserDto) : filterUserDto

    return await User.find({
      where: {
        ...filter,
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'patronymic',
        'firstName',
        'email',
        'createAt',
      ],
    })
  }

  async create({
    firstName,
    lastName,
    patronymic,
    password,
    email,
  }): Promise<User> {
    const hashPassword = await hash(password, 8)

    const emailIsFree = await User.findOne({
      where: {
        email,
      },
    })

    if (emailIsFree) throw new BadRequestException('Email зайнятий')

    const user = await User.create({
      firstName,
      lastName,
      patronymic,
      password: hashPassword,
      email,
    }).save()

    return classToClass(user)
  }

  async findByIds(userIds: number[]): Promise<User[]> {
    return await User.createQueryBuilder('user')
      .select([
        'id',
        'firstName',
        'lastName',
        'patronymic',
        'firstName',
        'email',
        'createAt',
      ])
      .whereInIds(userIds)
      .getMany()
  }

  async findEntity(userId: number): Promise<User> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.teacher', 'teacher')
      .leftJoin('user.student', 'student')
      .select(['user.id', 'teacher.id', 'student.id'])
      .where('user.id = :userId ', { userId })
      .getOne()

    if (!user) throw new BadRequestException('Користувача не знайдено')

    return user
  }
}
