import { Injectable } from '@nestjs/common'
import { Permission } from './permission.entity'

import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreatePermissionDto } from './dto/createPermission.dto'
import { Test } from '../tests/test.entity'
import { User } from '../users/user.entity'

@Injectable()
export class PermissionsService {
  async create(
    createPermissionDto: CreatePermissionDto,
    test: Test,
    allower: User,
  ): Promise<Permission> {
    try {
      const permission = await Permission.create({
        ...createPermissionDto,
        test,
        allower,
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
      relations: ['allower', 'test'],
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
}
