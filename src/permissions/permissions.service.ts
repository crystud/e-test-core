import { BadRequestException, Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'
import { Group } from '../groups/group.entity'
import { Teacher } from '../teachers/teachers.entity'
import { Test } from '../tests/test.entity'

@Injectable()
export class PermissionsService {
  async create(
    group: Group,
    test: Test,
    teacher: Teacher,
    startTime: Date,
    endTime: Date,
  ): Promise<Permission> {
    const permission = await Permission.create({
      group,
      test,
      teacher,
      startTime,
      endTime,
    }).save()

    return await this.findOne(permission.id)
  }

  async findOne(permissionId: number): Promise<Permission> {
    const permission = await Permission.createQueryBuilder('permission')
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
        'teacher.id',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.patronymic',
        'user.firstName',
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
