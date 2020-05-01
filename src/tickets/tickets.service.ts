import { Injectable } from '@nestjs/common'
import { User } from '../users/user.entity'
import { AccessLevelType } from '../enums/accessLevelType'
import { Ticket } from './ticket.entity'
import { Permission } from '../permissions/permission.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@Injectable()
export class TicketsService {
  async create(
    title: string,
    permission: Permission,
    student: User,
  ): Promise<Ticket> {
    const ticket = await Ticket.create({
      title,
      permission,
      student,
    }).save()

    return this.findOne(ticket.id)
  }

  async createMany(
    title: string,
    permission: Permission,
    students: User[],
  ): Promise<boolean> {
    const tickets = students.map(student =>
      Ticket.create({ title, permission, student }),
    )

    try {
      await Ticket.save(tickets)

      return true
    } catch (e) {
      return false
    }
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await Ticket.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.permission', 'permission')
      .leftJoinAndSelect('permission.test', 'test')
      .leftJoinAndSelect('test.levels', 'levels')
      .leftJoinAndSelect('ticket.student', 'student')
      .leftJoinAndSelect('ticket.attempts', 'attempts')
      .select([
        'ticket.id',
        'ticket.title',
        'ticket.used',
        'ticket.usedTime',
        'test.id',
        'levels.id',
        'levels.difficult',
        'permission.id',
        'permission.createAt',
        'permission.startTime',
        'permission.endTime',
        'student.id',
        'attempts.id',
      ])
      .where('ticket.id = :ticketId', { ticketId: id })
      .getOne()

    if (!ticket) {
      throw new BadRequestExceptionError({
        property: 'ticketId',
        value: id,
        constraints: {
          isNotExist: 'ticket is not exist',
        },
      })
    }

    return ticket
  }

  async isStudent(ticket: Ticket, user: User): Promise<boolean> {
    return ticket.student.id === user.id
  }

  async isTeacher(ticket: Ticket, user: User): Promise<boolean> {
    const isTeacher = await Ticket.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.permission', 'permission')
      .leftJoinAndSelect('permission.allower', 'allower')
      .where('allower.id = :allowerID', { allowerID: user.id })
      .where('ticket.id = :ticketID', { ticketID: ticket.id })
      .getCount()

    return Boolean(isTeacher)
  }

  async accessRelations(
    ticket: Ticket,
    user: User,
  ): Promise<AccessLevelType[]> {
    const levels: AccessLevelType[] = []

    const [isStudent, isTeacher] = await Promise.all([
      this.isStudent(ticket, user),
      this.isTeacher(ticket, user),
    ])

    if (isStudent) levels.push(AccessLevelType.STUDENT)
    if (isTeacher) levels.push(AccessLevelType.TEACHER)

    return levels
  }

  async use(ticket: Ticket): Promise<Ticket> {
    if (!ticket.permission.actived)
      throw new BadRequestExceptionError({
        value: ticket.id,
        property: 'ticketId',
        constraints: {
          isNotActived: 'Time of ticket activity has already ended',
        },
      })

    if (ticket.used) {
      throw new BadRequestExceptionError({
        value: ticket.id,
        property: 'ticketId',
        constraints: {
          isNotActived: "Ticket's already used",
        },
      })
    }

    ticket.used = true
    ticket.usedTime = new Date()
    await ticket.save()

    return ticket
  }
}
