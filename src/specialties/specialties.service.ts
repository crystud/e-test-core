import { BadRequestException, Injectable } from '@nestjs/common'
import { Speciality } from './speciality.entity'
import { CreateSpecialityDto } from './dto/createSpeciality.dto'
import { Subject } from '../subject/subject.entity'

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
      .leftJoin('speciality.subjects', 'subjects')
      .select([
        'speciality.id',
        'speciality.name',
        'speciality.symbol',
        'speciality.yearOfStudy',
        'speciality.code',
        'subjects.id',
        'subjects.name',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'groups.active',
      ])
      .where('speciality.id = :specialityId ', { specialityId })
      .getOne()

    if (!speciality) throw new BadRequestException('Спеціальність не знайдено')

    speciality.groups.forEach(group => {
      group.speciality = new Speciality()
      group.speciality.yearOfStudy = speciality.yearOfStudy
      group.speciality.symbol = speciality.symbol
    })

    return speciality
  }

  async findAll(
    specialityName = '',
    showDisactivated = false,
  ): Promise<Speciality[]> {
    let specialtiesQueryBuilder = await Speciality.createQueryBuilder(
      'specialties',
    )
      .leftJoin('specialties.groups', 'groups')
      .leftJoin('specialties.subjects', 'subjects')
      .select([
        'specialties.id',
        'specialties.name',
        'specialties.symbol',
        'specialties.yearOfStudy',
        'specialties.code',
        'subjects.id',
        'subjects.name',
        'groups.id',
        'groups.active',
      ])
      .where('specialties.name like :name ', {
        name: `%${specialityName}%`,
      })

    if (showDisactivated) {
      specialtiesQueryBuilder = specialtiesQueryBuilder.andWhere(
        'groups.active IS TRUE',
      )
    }

    return specialtiesQueryBuilder.getMany()
  }

  async findEntity(specialityId: number): Promise<Speciality> {
    const speciality = await Speciality.createQueryBuilder('speciality')
      .leftJoin('speciality.groups', 'groups')
      .leftJoin('speciality.subjects', 'subjects')
      .select([
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.code',
        'subjects.id',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'groups.active',
      ])
      .where('speciality.id = :specialityId ', { specialityId })
      .getOne()

    if (!speciality) throw new BadRequestException('Спеціальність не знайдено')

    return speciality
  }

  async addSubject(
    speciality: Speciality,
    subject: Subject,
  ): Promise<Speciality> {
    speciality.subjects.push(subject)
    await speciality.save()

    return this.findOne(speciality.id)
  }
}
