import { BadRequestException, Injectable } from '@nestjs/common'

import { Group } from './group.entity'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Speciality } from '../specialties/speciality.entity'
import { Cron } from '@nestjs/schedule'
import { getConnection } from 'typeorm'

@Injectable()
export class GroupsService {
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const thread = await Group.createQueryBuilder('group')
      .leftJoin('group.speciality', 'speciality')
      .where('speciality.id = :specialityId', {
        specialityId: createGroupDto.speciality,
      })
      .andWhere('group.startYear = :startYear ', {
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
    const group = await Group.createQueryBuilder('group')
      .leftJoin('group.speciality', 'speciality')
      .select([
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
        'speciality.name',
        'speciality.code',
      ])
      .where('group.id = :groupId', { groupId })
      .getOne()

    if (!group) throw new BadRequestException('Групу не знайдено')

    return group
  }

  async findOne(groupId: number): Promise<Group> {
    const group = await Group.createQueryBuilder('group')
      .leftJoin('group.speciality', 'speciality')
      .leftJoin('speciality.subjects', 'subjects')
      .leftJoin('group.students', 'students')
      .leftJoin('students.user', 'users')
      .select([
        'group.id',
        'group.startYear',
        'group.number',
        'speciality.id',
        'speciality.yearOfStudy',
        'speciality.symbol',
        'speciality.name',
        'speciality.code',
        'subjects.id',
        'students.id',
        'students.scoringBook',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.patronymic',
        'users.avatar',
      ])
      .where('group.id = :groupId', { groupId })
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

  async findEntityByIds(groupIds: number[]): Promise<Group[]> {
    try {
      return await Group.createQueryBuilder('groups')
        .select(['groups.id'])
        .where('groups.id IN (:groupIds) ', { groupIds })
        .getMany()
    } catch (e) {
      throw new BadRequestException('Однієї з груп не існує')
    }
  }

  @Cron('0 0 1 9 *')
  async groupDeactivation(): Promise<void> {
    await getConnection().transaction(async transactionalEntityManager => {
      const groups = await transactionalEntityManager
        .getRepository(Group)
        .createQueryBuilder('groups')
        .leftJoin('groups.speciality', 'speciality')
        .select(['groups.id', 'groups.active'])
        .where(
          `(${new Date().getFullYear()} - groups.startYear) >= speciality.yearOfStudy`,
        )
        .andWhere('groups.active IS TRUE')
        .getMany()

      groups.map(group => (group.active = false))

      await transactionalEntityManager.getRepository(Group).save(groups)
    })
  }
}
