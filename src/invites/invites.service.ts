import { BadRequestException, Injectable } from '@nestjs/common'
import { Invite } from './invite.entity'
import { Group } from '../groups/group.entity'
import { User } from '../users/user.entity'
import { getConnection } from 'typeorm'
import { Student } from '../students/student.entity'
import cryptoRandomString from 'crypto-random-string'
import { TokensInterface } from '../auth/interfaces/tokens.interface'
import { AuthService } from '../auth/auth.service'
import { hash } from 'bcryptjs'

@Injectable()
export class InvitesService {
  constructor(private readonly authService: AuthService) {}

  async create(
    firstName: string,
    lastName: string,
    patronymic: string,
    scoringBook: number,
    group: Group,
    creator: User,
  ): Promise<Invite> {
    let invite = null

    await getConnection().transaction(async transactionalEntityManager => {
      let user = User.create({
        firstName,
        lastName,
        patronymic,
        email: null,
        password: null,
      })

      user = await transactionalEntityManager.save(user)

      let student = Student.create({
        user,
        group,
        scoringBook,
      })

      student = await transactionalEntityManager.save(student)

      invite = Invite.create({
        student,
        creator,
        code: cryptoRandomString({ length: 14, type: 'base64' }),
      })

      invite = await transactionalEntityManager.save(invite)
    })

    return await this.findOne(invite.id)
  }

  async createMany(
    invitesData: {
      firstName: string
      lastName: string
      patronymic: string
      scoringBook: number
    }[],
    group: Group,
    creator: User,
  ): Promise<Invite[]> {
    let invites = []

    await getConnection().transaction(async transactionalEntityManager => {
      let users = invitesData.map<User>(inviteData =>
        User.create({
          firstName: inviteData.firstName,
          lastName: inviteData.lastName,
          patronymic: inviteData.patronymic,
          email: null,
          password: null,
        }),
      )

      users = await transactionalEntityManager.save(users)

      let students = invitesData.map<Student>((inviteData, index) =>
        Student.create({
          user: users[index],
          group,
          scoringBook: inviteData.scoringBook,
        }),
      )

      students = await transactionalEntityManager.save(students)

      invites = students.map<Invite>(student =>
        Invite.create({
          student,
          creator,
          code: cryptoRandomString({ length: 14, type: 'base64' }),
        }),
      )

      invites = await transactionalEntityManager.save(invites)
    })

    return invites
  }

  async findOne(inviteId: number): Promise<Invite> {
    const invite = await Invite.createQueryBuilder('invite')
      .leftJoin('invite.student', 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'invite.id',
        'invite.createAt',
        'invite.usedAt',
        'invite.code',
        'student.id',
        'student.scoringBook',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .where('invite.id = :inviteId', { inviteId })
      .getOne()

    if (!invite) throw new BadRequestException('Запрошення не знайдено')

    return invite
  }

  async findOneByCode(code: string): Promise<Invite> {
    const invite = await Invite.createQueryBuilder('invite')
      .leftJoin('invite.student', 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'invite.id',
        'invite.createAt',
        'invite.usedAt',
        'invite.code',
        'student.id',
        'student.scoringBook',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .where('invite.usedAt IS NULL')
      .andWhere('invite.code = :code', { code })
      .getOne()

    if (!invite) throw new BadRequestException('Запрошення не знайдено')

    return invite
  }

  async activate(
    code: string,
    email: string,
    passport: string,
  ): Promise<TokensInterface> {
    let invite = null

    await getConnection().transaction(async transactionalEntityManager => {
      invite = await transactionalEntityManager
        .getRepository(Invite)
        .createQueryBuilder('invite')
        .leftJoin('invite.student', 'student')
        .leftJoin('student.user', 'user')
        .select(['invite.id', 'student.id', 'user.id', 'user.createAt'])
        .where('invite.code = :code', { code })
        .andWhere('invite.usedAt IS NULL')
        .getOne()

      if (!invite) throw new BadRequestException('Даного коду не існує')

      const emailIsFree = await transactionalEntityManager
        .getRepository(User)
        .createQueryBuilder('user')
        .select(['user.id'])
        .where({ email })
        .getOne()

      if (emailIsFree) throw new BadRequestException('Email зайнятий')

      global.console.log(invite.student.user)

      await transactionalEntityManager
        .getRepository(User)
        .createQueryBuilder()
        .update()
        .set({
          email,
          password: await hash(passport, 8),
        })
        .where('id = :userId', { userId: invite.student.user.id })
        .execute()

      await transactionalEntityManager
        .getRepository(Invite)
        .createQueryBuilder()
        .update()
        .set({
          usedAt: new Date(),
        })
        .where('id = :inviteId', { inviteId: invite.id })
        .execute()
    })

    return this.authService.createTokens(invite.student.user)
  }

  async findAll(
    user: User,
    limit: number,
    offset: number,
    onlyUnused: boolean,
    onlyOwn: boolean,
  ): Promise<Invite[]> {
    let invitesQuaryBuilder = Invite.createQueryBuilder('invites')
      .leftJoin('invites.creator', 'creator')
      .leftJoin('invites.student', 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'invites.id',
        'invites.createAt',
        'invites.usedAt',
        'invites.code',
        'student.id',
        'student.scoringBook',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])

    if (onlyUnused) {
      invitesQuaryBuilder = invitesQuaryBuilder.where('invites.usedAt IS NULL')
    }

    if (onlyOwn) {
      invitesQuaryBuilder = invitesQuaryBuilder.where(
        'creator.id = :creatorId',
        { creatorId: user.id },
      )
    }

    return invitesQuaryBuilder
      .limit(limit)
      .offset(offset)
      .getMany()
  }
}
