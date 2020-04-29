import { Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'

import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreatePermissionDto } from './dto/createPermission.dto'
import { Test } from '../tests/test.entity'
import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'

import { AccessLevelType } from '../enums/accessLevelType'

@Injectable()
export class PermissionsService {
  async create(
    createPermissionDto: CreatePermissionDto,
    test: Test,
    allower: User,
    groups: Group[],
  ): Promise<Permission> {
    try {
      const permission = await Permission.create({
        ...createPermissionDto,
        test,
        allower,
        groups,
      }).save()

      return await this.findOne(permission.id)
    } catch (e) {
      if (e.name === 'QueryFailedError' && e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestExceptionError({
          property: 'field',
          value: '',
          constraints: {
            duplicate: e.message,
          },
        })
      }
    }
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await Permission.findOne({
      where: {
        id,
      },
      relations: ['allower', 'test', 'groups', 'tickets'],
    })

    if (!permission) {
      throw new BadRequestExceptionError({
        property: 'permissionId',
        value: id,
        constraints: {
          isNotExist: 'permission is not exist',
        },
      })
    }

    return permission
  }

  async isStudent(permission: Permission, student: User): Promise<boolean> {
    const isStudent = await Permission.createQueryBuilder('permission')
      .leftJoinAndSelect('permission.tickets', 'tickets')
      .leftJoinAndSelect('tickets.student', 'student')
      .where('permission.id = :permissionID', { permissionID: permission.id })
      .where('student.id = :studentID', { studentID: student.id })
      .getCount()

    return Boolean(isStudent)
  }

  async isAllower(permission: Permission, user: User): Promise<boolean> {
    return permission.allower.id === user.id
  }

  async accessRelations(
    permission: Permission,
    user: User,
  ): Promise<AccessLevelType[]> {
    const levels: AccessLevelType[] = []

    const [isStudent, isAllower] = await Promise.all([
      this.isStudent(permission, user),
      this.isAllower(permission, user),
    ])

    if (isStudent) levels.push(AccessLevelType.STUDENT)
    if (isAllower) levels.push(AccessLevelType.ALLOWER)

    return levels
  }
}
