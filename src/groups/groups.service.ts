import { Injectable } from '@nestjs/common'

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

    return await Group.create({
      ...createGroupDto,
      number: thread + 1,
      speciality: Speciality.create({ id: createGroupDto.speciality }),
    }).save()
  }

  async findOne(groupsId: number): Promise<Group> {
    return await Group.createQueryBuilder('groups')
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
      .where('groups.id = :groupsId ', { groupsId })
      .getOne()
  }
}
