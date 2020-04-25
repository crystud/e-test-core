import { Injectable } from '@nestjs/common'
import { Group } from './group.entity'
import { Speciality } from '../specialties/speciality.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreateGroupDto } from './dto/createGroup.dto'
import * as moment from 'moment'
import { User } from '../users/user.entity'

@Injectable()
export class GroupsService {
  async findOne(id: number): Promise<Group> {
    const group = await Group.findOne({
      where: {
        id,
      },
      relations: ['speciality', 'students'],
    })

    if (!group) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'group is not exist',
        },
      })
    }

    return group
  }

  async create(
    createGroupDto: CreateGroupDto,
    speciality: Speciality,
  ): Promise<Group> {
    try {
      const startEducation = moment(createGroupDto.startEducation).format(
        'YYYY-MM-DD',
      )

      const endEducation = moment(createGroupDto.endEducation).format(
        'YYYY-MM-DD',
      )

      const [stream] = await Group.find({
        order: {
          number: 'DESC',
        },
        where: {
          startEducation,
          endEducation,
          speciality,
        },
        take: 1,
      })

      const group = await Group.create({
        ...createGroupDto,
        startEducation,
        endEducation,
        speciality,
        number: stream?.number ? stream.number + 1 : 1,
      }).save()

      return await this.findOne(group.id)
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

  async addStudent(group: Group, user: User): Promise<Group> {
    if (this.isStudent(group, user))
      throw new BadRequestExceptionError({
        property: 'student',
        value: user.id,
        constraints: {
          duplicate: 'student is duplicate in group',
        },
      })

    group.students.push(user)
    await group.save()

    return await this.findOne(group.id)
  }

  isStudent(group: Group, user: User): boolean {
    return group.students.some(student => student.id === user.id)
  }
}
