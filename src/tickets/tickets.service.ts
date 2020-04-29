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
    const ticket = await Ticket.findOne({
      where: {
        id,
      },
      relations: ['student', 'permission'],
    })

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
}
