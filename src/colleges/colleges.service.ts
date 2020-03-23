import { Injectable } from '@nestjs/common'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { College } from './college.entity'
import { User } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { Like } from 'typeorm'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@Injectable()
export class CollegesService {
  async create(
    createCollegeDto: CreateCollegeDto,
    user: User,
  ): Promise<College> {
    try {
      const college = await College.create({
        ...createCollegeDto,
        creator: user,
      }).save()

      return await this.findOne(college.id)
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

  async findOne(id: number): Promise<College> {
    const college = await College.findOne({
      where: {
        id,
      },
      relations: ['creator', 'editors'],
    })

    if (!college) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'college is not exist',
        },
      })
    }

    return college
  }

  async findAll(
    filterCollegeDto: FilterCollegeDto,
    like = true,
  ): Promise<College[]> {
    const filter: { [k: string]: any } = {}

    for (const filterItem in filterCollegeDto) {
      if (like && typeof filterCollegeDto[filterItem] === 'string') {
        filter[filterItem] = Like(`%${filterCollegeDto[filterItem]}%`)
      } else {
        filter[filterItem] = filterCollegeDto[filterItem]
      }
    }

    return await College.find({
      where: {
        ...filter,
      },
      relations: ['creator', 'editors'],
    })
  }

  async findOwn(user: User): Promise<College[]> {
    return await this.findAll(
      {
        creator: user.id,
      },
      false,
    )
  }

  async confirm(id: number): Promise<College> {
    await College.update(
      {
        id,
      },
      {
        confirmed: true,
      },
    )

    return await this.findOne(id)
  }

  async addEditor(college: College, user: User): Promise<College> {
    college.editors.push(user)

    await college.save()

    return this.findOne(college.id)
  }

  async findEditable(user: User): Promise<College[]> {
    const { editableColleges } = await User.findOne({
      where: {
        id: user.id,
      },
      relations: ['editableColleges'],
    })

    return editableColleges
  }
}
