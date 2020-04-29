import { Injectable } from '@nestjs/common'
import { User } from '../users/user.entity'
import { AccessLevelType } from '../enums/accessLevelType'
import { Ticket } from './ticket.entity'

@Injectable()
export class TicketsService {
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
