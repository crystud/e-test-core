import { Injectable } from '@nestjs/common'
import { Group } from './group.entity'
import { Speciality } from '../specialties/speciality.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { CreateGroupDto } from './dto/createGroup.dto'

@Injectable()
export class GroupsService {
  async findOne(id: number): Promise<Group> {
    return await Group.findOne(id, {
      relations: ['students', 'speciality'],
    })
  }

  async create(
    createGroupDto: CreateGroupDto,
    speciality: Speciality,
  ): Promise<Group> {
    try {
      const [stream] = await Group.find({
        select: ['number'],
        order: {
          number: 'ASC',
        },
        where: {
          ...createGroupDto,
          speciality,
        },
        take: 1,
      })

      const group = await Group.create({
        ...createGroupDto,
        speciality,
        number: stream?.number ? stream.number : 1,
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
