import { Injectable } from '@nestjs/common'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'

@Injectable()
export class SpecialtiesService {
  async create(createSpecialityDto: CreateSpecialityDto): Promise<Speciality> {
    return await Speciality.create({
      ...createSpecialityDto,
    }).save()
  }

  async findOne(specialityId: number): Promise<Speciality> {
    return await Speciality.createQueryBuilder('speciality')
      .select([
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .where('speciality.id = :specialityId ', { specialityId })
      .getOne()
  }

  async findAll(specialityName: string): Promise<Speciality[]> {
    return await Speciality.createQueryBuilder('speciality')
      .select([
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
      ])
      .where('speciality.name like :name ', {
        name: `%${specialityName}%`,
      })
      .getMany()
  }
}
