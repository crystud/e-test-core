import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { hash } from 'bcryptjs'
import { classToClass } from 'class-transformer'
import { UserRolesType } from '../enums/userRolesType'
import { FilterUserDto } from './dto/filterUser.dto'

import { ConfigService } from '@nestjs/config'
import { Environments } from '../config/environments.enum'
import { dbStringLikeBuilder } from '../tools/dbRequestBuilders/dbStringLike.builder'

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  async findOne(id: number): Promise<User> {
    const user = await User.createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.firstName',
        'user.email',
        'user.roles',
        'user.createAt',
      ])
      .where('user.id = :userId', { userId: id })
      .getOne()

    if (!user) throw new BadRequestException()

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
        'roles',
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

    if (emailIsFree) throw new BadRequestException()

    const user = await User.create({
      firstName,
      lastName,
      patronymic,
      password: hashPassword,
      email,
      roles:
        this.configService.get<string>('env') === Environments.DEVELOPMENT
          ? [UserRolesType.USER]
          : null,
    }).save()

    return classToClass(user, { groups: [...user.roles] })
  }

  isAdmin(user: User): boolean {
    return user.roles.includes(UserRolesType.ADMIN)
  }

  async findByIds(userIds: number[]): Promise<User[]> {
    return await User.findByIds(userIds, {
      select: [
        'id',
        'firstName',
        'lastName',
        'patronymic',
        'firstName',
        'email',
        'roles',
        'createAt',
      ],
    })
  }
}
