import { Injectable } from '@nestjs/common'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { College } from '../colleges/college.entity'
import { Study } from '../studies/study.entity'

@Injectable()
export class SpecialtiesService {
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
      relations: ['college', 'groups', 'studies'],
    })

    if (!speciality) {
      throw new BadRequestExceptionError({
        property: 'specialityId',
        value: id,
        constraints: {
          isNotExist: 'speciality is not exist',
        },
      })
    }

    return speciality
  }

  hasStudy(speciality: Speciality, study: Study): boolean {
    return speciality.studies.some(value => value.id === study.id)
  }

  async addStudy(speciality: Speciality, study: Study): Promise<Speciality> {
    if (this.hasStudy(speciality, study)) {
      throw new BadRequestExceptionError({
        property: 'studyId',
        value: study.id,
        constraints: {
          isNotExist: 'Cannon add study which already is in the speciality',
        },
      })
    }

    speciality.studies.push(study)

    await speciality.save()

    return speciality
  }
}
