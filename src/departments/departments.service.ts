import { Injectable } from '@nestjs/common'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Department } from './department.entity'
import { CreateDepartmentDto } from './dto/createDepartment.dto'
import { College } from '../colleges/college.entity'

@Injectable()
export class DepartmentsService {
  async create(
    createDepartmentDto: CreateDepartmentDto,
    college: College,
  ): Promise<Department> {
    try {
      const department = await Department.create({
        ...createDepartmentDto,
        college,
      }).save()

      return await this.findOne(department.id)
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

  async findOne(id: number): Promise<Department> {
    const department = await Department.findOne({
      where: {
        id,
      },
      relations: ['college'],
    })

    if (!department) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'department is not exist',
        },
      })
    }

    return department
  }
}
