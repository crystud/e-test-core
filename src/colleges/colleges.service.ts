import { Injectable } from '@nestjs/common'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { College } from './college.entity'
import { CollegeInterface } from './interfaces/college.interface'
import { User } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { Like } from 'typeorm'
import { BadRequestExceptionError } from '../tools/BadRequestExceptionError'

@Injectable()
export class CollegesService {
  private format(college: College): CollegeInterface {
    return {
      email: college.email,
      address: college.address,
      name: college.name,
      EDBO: college.EDBO,
      site: college.site,
      creator: college.creator.id,
      editors: college.editors.map<number>(editor => editor.id),
    }
  }

  async create(
    createCollegeDto: CreateCollegeDto,
    user: User,
  ): Promise<CollegeInterface> {
    const college = await College.create({
      ...createCollegeDto,
      creator: user,
    }).save()

    return this.format(college)
  }

  async findOne(id: number): Promise<CollegeInterface> {
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
          isNotExist: 'college id is incorrect',
        },
      })
    }

    return this.format(college)
  }

  async findAll(
    filterCollegeDto: FilterCollegeDto,
    like = true,
  ): Promise<CollegeInterface[]> {
    const filter: { [k: string]: any } = {}

    for (const filterItem in filterCollegeDto) {
      if (like && typeof filterCollegeDto[filterItem] === 'string') {
        filter[filterItem] = Like(`%${filterCollegeDto[filterItem]}%`)
      } else {
        filter[filterItem] = filterCollegeDto[filterItem]
      }
    }

    const colleges = await College.find({
      where: {
        ...filter,
      },
      relations: ['creator', 'editors'],
    })

    return colleges.map<CollegeInterface>(college => {
      return this.format(college)
    })
  }

  async findOwn(user: User): Promise<CollegeInterface[]> {
    return await this.findAll(
      {
        creator: user.id,
      },
      false,
    )
  }

  async confirm(id: number): Promise<CollegeInterface> {
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
}
