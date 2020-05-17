import { BadRequestException, Injectable } from '@nestjs/common'
import { Ticket } from './ticket.entity'
import { Student } from '../students/student.entity'
import { Permission } from '../permissions/permission.entity'

@Injectable()
export class TicketsService {
  async create(student: Student, permission: Permission): Promise<Ticket> {
    const ticket = await Ticket.create({
      student,
      permission,
    })

    return this.findOne(ticket.id)
  }

  entityBuilder(student: Student, permission: Permission): Ticket {
    return Ticket.create({
      student,
      permission,
    })
  }

  async findEntity(ticketId: number): Promise<Ticket> {
    const ticket = await Ticket.createQueryBuilder('ticket')
      .leftJoin('ticket.student', 'student')
      .leftJoin('ticket.permission', 'permission')
      .select([
        'ticket.id',
        'ticket.createAt',
        'student.id',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
      ])
      .where('ticket.id = :ticketId', { ticketId })
      .getOne()

    if (!ticket) throw new BadRequestException('Квиток не знайдено')

    return ticket
  }

  async findOne(ticketId: number): Promise<Ticket> {
    const ticket = await Ticket.createQueryBuilder('ticket')
      .leftJoin('ticket.student', 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('ticket.permission', 'permission')
      .select([
        'ticket.id',
        'ticket.createAt',
        'student.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'permission.id',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
      ])
      .where('ticket.id = :ticketId', { ticketId })
      .getOne()

    if (!ticket) throw new BadRequestException('Квиток не знайдено')

    return ticket
  }

  async activate(ticket: Ticket): Promise<Ticket> {
    return ticket
  }

  async findByStudent(student: Student): Promise<Ticket[]> {
    return await Ticket.createQueryBuilder('tickets')
      .leftJoin('tickets.student', 'student')
      .leftJoin('tickets.permission', 'permission')
      .select([
        'tickets.id',
        'tickets.createAt',
        'permission.id',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
      ])
      .where('student.id = :studentId', { studentId: student.id })
      .getMany()
  }
}
