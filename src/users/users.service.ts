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
      .leftJoin('students.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .leftJoin('user.teachers', 'teachers')
      .leftJoin('teachers.subject', 'subject')
      .select([
        'user.id',
        'user.patronymic',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.createAt',
        'students.id',
        'students.scoringBook',
        'group.id',
        'group.number',
        'group.startYear',
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
        'teachers.id',
        'subject.id',
        'subject.name',
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
      .leftJoin('user.teachers', 'teachers')
      .leftJoin('user.students', 'students')
      .select(['user.id', 'teachers.id', 'students.id'])
      .where('user.id = :userId ', { userId })
      .getOne()

    if (!user) throw new BadRequestException('Користувача не знайдено')

    return user
  }
}
