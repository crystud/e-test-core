import { BadRequestException, Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'
import { Group } from '../groups/group.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Test } from '../tests/test.entity'
import { TicketsService } from '../tickets/tickets.service'
import { Ticket } from '../tickets/ticket.entity'
import { TestsService } from '../tests/tests.service'
import { getConnection } from 'typeorm'
import { ResultSelectingMethodType } from './enums/resultSelectingMethodType'
import { maxBy, meanBy, last, isEmpty } from 'lodash'
import { PermissionReportInterface } from './interfaces/permissionReport.interface'
import { classToClass } from 'class-transformer'
import { PermissionReportResultInterface } from './interfaces/permissionReportResult.interface'
import { Attempt } from '../attempts/attempt.entity'
import { isAfter } from 'date-fns'

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
    resultSelectingMethod: ResultSelectingMethodType,
  ): Promise<Permission> {
    const testStatus = await this.testsService.status(test)

    if (!testStatus.completed)
      throw new BadRequestException('В тесті замало питань')

    if (!group._filled) throw new BadRequestException('В групі немає студентів')

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
          resultSelectingMethod,
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
        'permission.resultSelectingMethod',
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
        'group.active',
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
        'permission.resultSelectingMethod',
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
        'group.active',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
      ])
      .where('teacher.id = :teacherId', { teacherId })
      .orderBy('permission.createAt', 'DESC')
      .getMany()
  }

  async getReport(permissionId: number): Promise<PermissionReportInterface> {
    const permission = await Permission.createQueryBuilder('permission')
      .leftJoin('permission.test', 'test')
      .leftJoin('permission.teacher', 'teacher')
      .leftJoin('teacher.user', 'teacher_user')
      .leftJoin('teacher.subject', 'subject')
      .leftJoin('permission.group', 'group')
      .leftJoin('group.speciality', 'speciality')
      .leftJoin('permission.tickets', 'tickets')
      .leftJoin('tickets.attempts', 'attempts')
      .leftJoin('attempts.result', 'result')
      .leftJoin('tickets.student', 'student')
      .leftJoin('student.user', 'student_user')
      .select([
        'permission.id',
        'permission.startTime',
        'permission.endTime',
        'permission.createAt',
        'permission.maxCountOfUse',
        'permission.resultSelectingMethod',
        'test.id',
        'test.name',
        'test.duration',
        'teacher.id',
        'teacher_user.firstName',
        'teacher_user.lastName',
        'teacher_user.patronymic',
        'teacher_user.firstName',
        'teacher_user.avatar',
        'subject.name',
        'group.startYear',
        'group.number',
        'group.active',
        'speciality.yearOfStudy',
        'speciality.symbol',
        'tickets.id',
        'attempts.startTime',
        'attempts.endTime',
        'attempts.maxScore',
        'result.score',
        'result.percent',
        'student.scoringBook',
        'student_user.firstName',
        'student_user.lastName',
        'student_user.patronymic',
        'student_user.firstName',
        'student_user.avatar',
      ])
      .where('permission.id = :permissionId', { permissionId })
      .orderBy('attempts.endTime', 'ASC')
      .getOne()

    if (!permission) {
      throw new BadRequestException('Дозвіл не знайдено')
    }

    if (isAfter(permission.endTime, new Date())) {
      throw new BadRequestException('Тестування ще не закінчено')
    }

    const results: PermissionReportResultInterface[] = []

    permission.tickets.forEach(ticket => {
      let result: Attempt | number | null

      if (isEmpty(ticket.attempts)) result = null
      else {
        ticket.attempts = ticket.attempts.filter(attempt => attempt.endTime)

        switch (permission.resultSelectingMethod) {
          case ResultSelectingMethodType.BEST_RESULT:
            result = maxBy(ticket.attempts, attempt =>
              Number(attempt.result.percent),
            )

            break
          case ResultSelectingMethodType.AVG_RESULT:
            result = meanBy(ticket.attempts, attempt => attempt.result.percent)

            break
          case ResultSelectingMethodType.LAST_RESULT:
            result = last(ticket.attempts)

            break
        }
      }

      results.push({
        student: ticket.student,
        result,
      })
    })

    delete permission.tickets

    return {
      permission: classToClass(permission),
      results: classToClass(results),
    }
  }
}
