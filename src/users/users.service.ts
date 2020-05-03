import { Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { hash } from 'bcryptjs'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { classToClass } from 'class-transformer'
import { UserRolesType } from '../enums/userRolesType'
import { FilterUserDto } from './dto/filterUser.dto'
import { dbStringLikeBuilder } from '../tools/dbRequestBuilers/dbStringLike.builder'
import { Group } from '../groups/group.entity'
import { College } from '../colleges/college.entity'
import { Ticket } from '../tickets/ticket.entity'
import { Result } from '../results/result.entity'
import { Subject } from '../subjects/subject.entity'
import { Permission } from '../permissions/permission.entity'
import { Attempt } from '../attempts/attempt.entity'
import { Test } from '../tests/test.entity'
import { Study } from '../studies/study.entity'

@Injectable()
export class UsersService {
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

  async findGroups(userId: number): Promise<Group[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.groups', 'groups')
      .leftJoin('groups.speciality', 'speciality')
      .select([
        'user.id',
        'groups.id',
        'speciality.id',
        'groups.startEducation',
        'groups.endEducation',
        'groups.number',
        'speciality.symbol',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.groups
  }

  async findOwnColleges(userId: number): Promise<College[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.ownColleges', 'ownColleges')
      .leftJoin('ownColleges.specialties', 'specialties')
      .leftJoin('ownColleges.creator', 'creator')
      .select([
        'user.id',
        'ownColleges.name',
        'ownColleges.address',
        'ownColleges.confirmed',
        'ownColleges.email',
        'ownColleges.site',
        'ownColleges.EDBO',
        'specialties.id',
        'creator.id',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.ownColleges
  }

  async findEditableColleges(userId: number): Promise<College[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.editableColleges', 'editableColleges')
      .leftJoin('editableColleges.specialties', 'specialties')
      .leftJoin('editableColleges.creator', 'creator')
      .select([
        'user.id',
        'editableColleges.name',
        'editableColleges.address',
        'editableColleges.confirmed',
        'editableColleges.email',
        'editableColleges.site',
        'editableColleges.EDBO',
        'specialties.id',
        'creator.id',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.editableColleges
  }

  async findTickets(userId: number): Promise<Ticket[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.tickets', 'tickets')
      .leftJoin('tickets.student', 'student')
      .leftJoin('tickets.permission', 'permission')
      .select([
        'user.id',
        'tickets.id',
        'tickets.title',
        'tickets.used',
        'tickets.usedTime',
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.patronymic',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.tickets
  }

  async findResults(userId: number): Promise<Result[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.results', 'results')
      .leftJoin('results.attempt', 'attempt')
      .leftJoin('results.student', 'student')
      .select([
        'user.id',
        'results.id',
        'results.resultScore',
        'results.persents',
        'attempt.maxScore',
        'attempt.endTime',
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.patronymic',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.results
  }

  async findSubjects(userId: number): Promise<Subject[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.teachSubjects', 'teachSubjects')
      .select([
        'user.id',
        'teachSubjects.id',
        'teachSubjects.name',
        'teachSubjects.confirmed',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.teachSubjects
  }

  async findPermissions(userId: number): Promise<Permission[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.permissions', 'permissions')
      .leftJoin('permissions.groups', 'groups')
      .leftJoin('permissions.study', 'study')
      .leftJoin('permissions.tickets', 'tickets')
      .select([
        'user.id',
        'permissions.id',
        'permissions.startTime',
        'permissions.endTime',
        'permissions.createAt',
        'permissions.createAt',
        'groups.id',
        'study.id',
        'study.id',
        'tickets.id',
        'tickets.used',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.permissions
  }

  async findAttempts(userId: number): Promise<Attempt[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.attempts', 'attempts')
      .leftJoin('attempts.result', 'result')
      .leftJoin('attempts.ticket', 'ticket')
      .select([
        'user.id',
        'attempts.id',
        'attempts.maxScore',
        'attempts.endTime',
        'result.id',
        'result.resultScore',
        'ticket.id',
        'ticket.title',
        'ticket.usedTime',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.attempts
  }

  async findTests(userId: number): Promise<Test[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.tests', 'tests')
      .leftJoin('tests.subject', 'subject')
      .leftJoin('tests.studies', 'studies')
      .leftJoin('tests.colleges', 'colleges')
      .select([
        'user.id',
        'tests.title',
        'tests.description',
        'tests.isPublic',
        'subject.id',
        'subject.name',
        'studies.id',
        'colleges.id',
        'colleges.name',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.tests
  }

  async findStudies(userId: number): Promise<Study[]> {
    const user = await User.createQueryBuilder('user')
      .leftJoin('user.studies', 'studies')
      .leftJoin('studies.subject', 'subject')
      .leftJoin('studies.college', 'college')
      .select([
        'user.id',
        'studies.id',
        'subject.id',
        'subject.name',
        'college.id',
        'college.name',
      ])
      .where('user.id = :userId', { userId })
      .getOne()

    return user.studies
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
