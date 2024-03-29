import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { hash } from 'bcryptjs'

import { ConfigService } from '@nestjs/config'

import { UserRolesType } from '../enums/userRolesType'
import { getConnection, Like } from 'typeorm'
import { AdminsService } from '../admins/admins.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminsService: AdminsService,
  ) {}

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
        'user.avatar',
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

  async findAll(
    firstName: string,
    lastName: string,
    patronymic: string,
    roles: UserRolesType[],
    isNotInRoles: UserRolesType[],
    offset: number,
    limit: number,
    like = true,
  ): Promise<User[]> {
    const filter = {
      firstName: Like(`%${firstName}%`),
      lastName: Like(`%${lastName}%`),
      patronymic: Like(`%${patronymic}%`),
    }

    let usersQueryBuilder = await User.createQueryBuilder('users')
      .leftJoin('users.teachers', 'teachers')
      .leftJoin('users.students', 'students')
      .leftJoin('users.admin', 'admin')
      .select([
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.patronymic',
        'users.email',
        'users.avatar',
      ])
      .where(filter)

    // TODO: refactor to function

    if (roles.includes(UserRolesType.ADMIN))
      usersQueryBuilder = usersQueryBuilder.andWhere('admin.id IS NOT NULL')

    if (roles.includes(UserRolesType.TEACHER))
      usersQueryBuilder = usersQueryBuilder.andWhere('teachers.id IS NOT NULL')

    if (roles.includes(UserRolesType.STUDENT))
      usersQueryBuilder = usersQueryBuilder.andWhere('students.id IS NOT NULL')

    if (isNotInRoles.includes(UserRolesType.ADMIN))
      usersQueryBuilder = usersQueryBuilder.andWhere('admin.id IS NULL')

    if (isNotInRoles.includes(UserRolesType.TEACHER))
      usersQueryBuilder = usersQueryBuilder.andWhere('teachers.id IS NULL')

    if (isNotInRoles.includes(UserRolesType.STUDENT))
      usersQueryBuilder = usersQueryBuilder.andWhere('students.id IS NULL')

    return await usersQueryBuilder
      .take(limit)
      .skip(offset)
      .getMany()
  }

  async create({
    firstName,
    lastName,
    patronymic,
    password,
    email,
    avatar,
  }): Promise<User> {
    let user: User

    await getConnection().transaction(async transactionalEntityManager => {
      const [emailIsFree, countOfUser] = await Promise.all([
        transactionalEntityManager.getRepository(User).findOne({
          where: {
            email,
          },
        }),
        transactionalEntityManager
          .getRepository(User)
          .createQueryBuilder()
          .getCount(),
      ])

      if (emailIsFree) throw new BadRequestException('Email зайнятий')

      const hashPassword = await hash(password, 8)

      user = await User.create({
        firstName,
        lastName,
        patronymic,
        password: hashPassword,
        email,
        avatar,
      }).save()

      if (countOfUser === 0) {
        await this.adminsService.create(user)
      }
    })

    delete user.password

    return user
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

  async getAvatar(user: User): Promise<string | null> {
    const { avatar } = await User.createQueryBuilder('user')
      .select(['user.id', 'user.avatar'])
      .where('user.id = :userId', { userId: user.id })
      .getOne()

    return avatar
  }

  async setAvatar(user: User, avatar): Promise<User> {
    user.avatar = avatar.base64

    await user.save()

    return user
  }
}
