import { Injectable } from '@nestjs/common'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { College } from '../colleges/college.entity'

@Injectable()
export class SpecialitysService {
  async create(
    createSpecialityDto: CreateSpecialityDto,
    college: College,
  ): Promise<Speciality> {
    try {
      const speciality = await Speciality.create({
        ...createSpecialityDto,
        college,
      }).save()

      return await this.findOne(speciality.id)
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

  async findOne(id: number): Promise<Speciality> {
    const speciality = await Speciality.findOne({
      where: {
        id,
      },
      relations: ['college', 'groups'],
    })

    if (!speciality) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'speciality is not exist',
        },
      })
    }

    return speciality
  }
}
