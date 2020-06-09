import { BadRequestException, Injectable } from '@nestjs/common'

import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Speciality } from '../specialties/speciality.entity'

@Injectable()
export class GroupsService {
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const thread = await Group.createQueryBuilder('group')
      .where('group.startYear = :startYear ', {
        startYear: createGroupDto.startYear,
      })
      .getCount()

    const group = await Group.create({
      ...createGroupDto,
      number: thread + 1,
      speciality: Speciality.create({ id: createGroupDto.speciality }),
    }).save()

    return this.findOne(group.id)
  }

  async findEntityPreview(groupId: number): Promise<Group> {
    const group = await Group.createQueryBuilder('groups')
      .leftJoin('groups.speciality', 'speciality')
      .select([
        'groups.id',
        'groups.startYear',
        'groups.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
        'speciality.name',
        'speciality.code',
      ])
      .whereInIds(groupId)
      .getOne()

    if (!group) throw new BadRequestException('Групу не знайдено')

    return group
  }

  async findOne(groupId: number): Promise<Group> {
    const group = await Group.createQueryBuilder('groups')
      .leftJoin('groups.speciality', 'speciality')
      .leftJoin('groups.students', 'students')
      .leftJoin('students.user', 'users')
      .select([
        'groups.id',
        'groups.startYear',
        'groups.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
        'speciality.name',
        'speciality.code',
        'students.id',
        'students.scoringBook',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.patronymic',
      ])
      .whereInIds(groupId)
      .getOne()

    if (!group) throw new BadRequestException('Групу не знайдено')

    return group
  }

  async findEntity(groupId): Promise<Group> {
    const group = await Group.createQueryBuilder('group')
      .leftJoin('group.students', 'students')
      .select(['group.id', 'students.id'])
      .where('group.id = :groupId ', { groupId })
      .getOne()

    if (!group) throw new BadRequestException('Групу не знайдено')

    return group
  }
}
