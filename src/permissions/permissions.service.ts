import { BadRequestException, Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'
import { Group } from '../groups/group.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Test } from '../tests/test.entity'
import { TicketsService } from '../tickets/tickets.service'
import { Ticket } from '../tickets/ticket.entity'
import { TestsService } from '../tests/tests.service'

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
  ): Promise<Permission> {
    const testStatus = await this.testsService.status(test)

    if (!testStatus.completed)
      throw new BadRequestException('В тесті замало питань')

    const permission = await Permission.create({
      group,
      test,
      teacher,
      startTime,
      endTime,
    }).save()

    const tickets = group.students.map<Ticket>(student =>
      this.ticketsService.entityBuilder(student, permission),
    )

    await Ticket.save(tickets)

    return await this.findOne(permission.id)
  }

  async findOne(permissionId: number): Promise<Permission> {
    const permission = await Permission.createQueryBuilder('permission')
      .leftJoin('permission.test', 'test')
      .leftJoin('permission.tickets', 'tickets')
      .leftJoin('tickets.student', 'student')
      .leftJoin('student.user', 'student_user')
      .leftJoin('permission.teacher', 'teacher')
      .leftJoin('teacher.user', 'teacher_user')
      .leftJoin('teacher.subject', 'subject')
      .leftJoin('permission.group', 'group')
      .select([
        'permission.id',
        'permission.startTime',
        'permission.endTime',
        'tickets.id',
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
      .leftJoin('permission.group', 'group')
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
      .select([
        'permission.id',
        'permission.startTime',
        'permission.endTime',
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
      ])
      .where('teacher.id = :teacherId', { teacherId })
      .getMany()
  }
}
