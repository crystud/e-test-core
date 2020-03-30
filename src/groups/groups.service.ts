import { Injectable } from '@nestjs/common'
import { Group } from './group.entity'
import { Speciality } from '../specialties/speciality.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreateGroupDto } from './dto/createGroup.dto'
import * as moment from 'moment'

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
}
