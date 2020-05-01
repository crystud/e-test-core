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
    const user = await User.createQueryBuilder('user')
      .leftJoinAndSelect('user.editableColleges', 'editableColleges')
      .leftJoinAndSelect('user.groups', 'groups')
      .leftJoinAndSelect('user.ownColleges', 'ownColleges')
      .leftJoinAndSelect('user.createSubjectRequests', 'createSubjectRequests')
      .leftJoinAndSelect('user.createTopicRequests', 'createTopicRequests')
      .leftJoinAndSelect('user.teachSubjects', 'teachSubjects')
      .leftJoinAndSelect('user.studies', 'studies')
      .leftJoinAndSelect('user.tests', 'tests')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect('user.tickets', 'tickets')
      .leftJoinAndSelect('user.results', 'results')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.firstName',
        'user.email',
        'user.roles',
        'user.createAt',
        'editableColleges.id',
        'groups.id',
        'ownColleges.id',
        'createSubjectRequests.id',
        'createTopicRequests.id',
        'teachSubjects.id',
        'studies.id',
        'tests.id',
        'permissions.id',
        'tickets.id',
        'results.id',
      ])
      .where('user.id = :userId', { userId: id })
      .getOne()

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
