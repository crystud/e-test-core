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
  public format(college: College): CollegeInterface {
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

  public formatAll(colleges: College[]): CollegeInterface[] {
    return colleges.map<CollegeInterface>(college => {
      return this.format(college)
    })
  }

  async create(
    createCollegeDto: CreateCollegeDto,
    user: User,
  ): Promise<College> {
    return await College.create({
      ...createCollegeDto,
      creator: user,
    }).save()
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
          isNotExist: 'college id is incorrect',
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
}
