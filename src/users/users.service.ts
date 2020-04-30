import { Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { hash } from 'bcryptjs'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { classToClass } from 'class-transformer'
import { UserRolesType } from '../enums/userRolesType'
import { FilterUserDto } from './dto/filterUser.dto'
import { dbStringLikeBuilder } from '../tools/dbRequestBuilers/dbStringLike.builder'

@Injectable()
export class UsersService {
  async findOne(id: number): Promise<User> {
    const user = await User.findOne(id, {
      relations: [
        'ownColleges',
        'editableColleges',
        'groups',
        'groups.speciality',
        'permissions',
        'teachSubjects',
        'studies',
        'createSubjectRequests',
        'createTopicRequests',
        'tests',
        'tickets',
        'attempts',
      ],
    })

    if (!user) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'user is not exist',
        },
      })
    }

    return user
  }

  async findAll(filterUserDto: FilterUserDto, like = true): Promise<User[]> {
    const filter = like ? dbStringLikeBuilder(filterUserDto) : filterUserDto

    return await User.find({
      where: {
        ...filter,
      },
      relations: [
        'ownColleges',
        'editableColleges',
        'groups',
        'groups.speciality',
        'teachSubjects',
        'studies',
        'createSubjectRequests',
        'createTopicRequests',
        'tests',
        'tickets',
        'attempts',
      ],
    })
  }

  async createUser({
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

    if (emailIsFree) {
      throw new BadRequestExceptionError({
        value: email,
        property: 'email',
        constraints: {
          unique: 'email must be never used',
        },
      })
    }

    const user = await User.create({
      firstName,
      lastName,
      patronymic,
      password: hashPassword,
      email,
    }).save()

    return classToClass<User>(user)
  }

  isAdmin(user: User): boolean {
    return user.roles.includes(UserRolesType.ADMIN)
  }
}
