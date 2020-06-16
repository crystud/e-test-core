import { BadRequestException, Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'
import { Group } from '../groups/group.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Test } from '../tests/test.entity'
import { TicketsService } from '../tickets/tickets.service'
import { Ticket } from '../tickets/ticket.entity'
import { TestsService } from '../tests/tests.service'
import { getConnection } from 'typeorm'

@Injectable()
export class PermissionsService {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly testsService: TestsService,
  ) {}

  async create(
    group: Group,
    test: Test,
    teacher: Teacher,
    startTime: Date,
    endTime: Date,
    maxCountOfUse: number | null,
  ): Promise<Permission> {
    const testStatus = await this.testsService.status(test)

    if (!testStatus.completed)
      throw new BadRequestException('В тесті замало питань')

    let permission

    await getConnection().transaction(async transactionalEntityManager => {
      permission = await transactionalEntityManager
        .getRepository(Permission)
        .create({
          group,
          test,
          teacher,
          startTime,
          endTime,
          maxCountOfUse,
        })
        .save()

      const tickets = group.students.map<Ticket>(student =>
        this.ticketsService.entityBuilder(student, permission),
      )

      await transactionalEntityManager
        .getRepository(Ticket)
        .createQueryBuilder()
        .insert()
        .into(Ticket)
        .values(tickets)
        .execute()
    })

    return await this.findOne(permission.id)
  }

  async findOne(permissionId: number): Promise<Permission> {
    const permission = await Permission.createQueryBuilder('permission')
      .leftJoin('permission.test', 'test')
      .leftJoin('permission.tickets', 'tickets')
      .leftJoin('tickets.attempts', 'attempts')
      .leftJoin('attempts.result', 'result')
      .leftJoin('tickets.student', 'student')
      .leftJoin('student.user', 'student_user')
      .leftJoin('permission.teacher', 'teacher')
      .leftJoin('teacher.user', 'teacher_user')
      .leftJoin('teacher.subject', 'subject')
      .leftJoin('permission.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .loadRelationCountAndMap('ticket.attemptsCount', 'tickets.attempts')
      .select([
        'permission.id',
        'permission.createAt',
        'permission.maxCountOfUse',
        'permission.startTime',
        'permission.endTime',
        'tickets.id',
        'attempts.id',
        'result.percent',
        'student.id',
        'student_user.id',
        'student_user.firstName',
        'student_user.lastName',
        'student_user.patronymic',
        'test.id',
        'test.name',
        'test.duration',
        'test.countOfTasks',
        'teacher.id',
        'teacher_user.id',
        'teacher_user.firstName',
        'teacher_user.lastName',
        'teacher_user.patronymic',
        'subject.id',
        'subject.name',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
      ])
      .where('permission.id = :permissionId', { permissionId })
      .getOne()

    if (!permission) throw new BadRequestException('Дозвіл не знайдено')

    return permission
  }

  async findEntity(permissionId: number): Promise<Permission> {
    const permission = await Permission.createQueryBuilder('permission')
      .leftJoin('permission.test', 'test')
      .leftJoin('permission.teacher', 'teacher')
      .leftJoin('teacher.user', 'teacher_user')
      .leftJoin('teacher.subject', 'subject')
      .select([
        'permission.id',
        'permission.startTime',
        'permission.endTime',
        'test.id',
        'test.name',
        'test.duration',
        'teacher.id',
        'teacher_user.id',
        'subject.id',
        'subject.name',
      ])
      .where('permission.id = :permissionId', { permissionId })
      .getOne()

    if (!permission) throw new BadRequestException('Дозвіл не знайдено')

    return permission
  }

  async findByTeacher(teacherId: number): Promise<Permission[]> {
    return await Permission.createQueryBuilder('permission')
      .leftJoin('permission.test', 'test')
      .leftJoin('permission.teacher', 'teacher')
      .leftJoin('teacher.user', 'user')
      .leftJoin('teacher.subject', 'subject')
      .leftJoin('permission.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'permission.id',
        'permission.startTime',
        'permission.endTime',
        'permission.createAt',
        'permission.maxCountOfUse',
        'test.id',
        'test.name',
        'test.duration',
        'teacher.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.firstName',
        'subject.id',
        'subject.name',
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
      ])
      .where('teacher.id = :teacherId', { teacherId })
      .orderBy('permission.createAt', 'DESC')
      .getMany()
  }
}
