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
    const speciality = await Speciality.createQueryBuilder('speciality')
      .leftJoin('speciality.groups', 'groups')
      .select([
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
        'groups.id',
        'groups.startYear',
        'groups.number',
      ])
      .where('speciality.id = :specialityId ', { specialityId })
      .getOne()

    speciality.groups.forEach(group => {
      group.speciality = new Speciality()
      group.speciality.yearOfStudy = speciality.yearOfStudy
      group.speciality.symbol = speciality.symbol
    })

    return speciality
  }

  async findAll(specialityName = ''): Promise<Speciality[]> {
    return await Speciality.createQueryBuilder('specialties')
      .leftJoin('specialties.groups', 'groups')
      .select([
        'specialties.id',
        'specialties.name',
        'specialties.symbol',
        'specialties.yearOfStudy',
        'specialties.code',
        'groups.id',
      ])
      .where('specialties.name like :name ', {
        name: `%${specialityName}%`,
      })
      .getMany()
  }
}
