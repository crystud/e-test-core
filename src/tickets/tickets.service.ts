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
      .leftJoin('ticket.attempts', 'attempts')
      .select([
        'ticket.id',
        'ticket.createAt',
        'student.id',
        'permission.id',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
        'attempts.id',
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
      .leftJoin('ticket.attempts', 'attempts')
      .leftJoin('attempts.result', 'result')
      .leftJoin('ticket.permission', 'permission')
      .leftJoin('permission.test', 'test')
      .select([
        'ticket.id',
        'ticket.createAt',
        'student.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'test.id',
        'test.name',
        'attempts.id',
        'attempts.startTime',
        'attempts.maxScore',
        'attempts.endTime',
        'attempts.maxEndTime',
        'result.id',
        'result.percent',
        'result.score',
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

  async findByStudent(
    student: Student,
    limit: number,
    offset: number,
    onlyIsNotOutstanding: boolean,
    onlyUnused: boolean,
  ): Promise<Ticket[]> {
    let ticketQueryBuilder = Ticket.createQueryBuilder('tickets')
      .leftJoin('tickets.student', 'student')
      .leftJoin('tickets.permission', 'permission')
      .leftJoin('tickets.attempts', 'attempts')
      .leftJoin('permission.test', 'test')
      .select([
        'tickets.id',
        'tickets.createAt',
        'permission.id',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
        'attempts.id',
        'attempts.startTime',
        'attempts.endTime',
        'attempts.maxEndTime',
        'test.id',
        'test.name',
      ])
      .where('student.id = :studentId', { studentId: student.id })

    if (onlyIsNotOutstanding)
      ticketQueryBuilder = ticketQueryBuilder.andWhere(
        'permission.endTime > NOW()',
      )

    if (onlyUnused) {
      ticketQueryBuilder = ticketQueryBuilder
        .addSelect('COUNT(attempts.id) as attemptsCount')
        .andHaving(
          '(permission.maxCountOfUse IS NULL OR attemptsCount < permission.maxCountOfUse)',
        )
    }

    return ticketQueryBuilder
      .groupBy('tickets.id')
      .orderBy('tickets.createAt', 'DESC')
      .take(limit)
      .offset(offset)
      .getMany()
  }
}
