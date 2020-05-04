import { BadRequestException, Injectable } from '@nestjs/common'

import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Speciality } from '../specialties/speciality.entity'
import { User } from '../users/user.entity'

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

  async findOne(groupId: number): Promise<Group> {
    return await Group.createQueryBuilder('groups')
      .leftJoin('groups.speciality', 'speciality')
      .leftJoin('groups.students', 'students')
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
        'students.firstName',
        'students.lastName',
        'students.patronymic',
        'students.email',
      ])
      .where('groups.id = :groupId ', { groupId })
      .getOne()
  }

  async addStudent(groupId: number, userId: number): Promise<Group> {
    const group = await this.findOne(groupId)

    if (group.students.some(student => student.id === Number(userId)))
      throw new BadRequestException('Користувач вже в групі')

    group.students.push(User.create({ id: userId }))

    await group.save()

    return await this.findOne(groupId)
  }
}
