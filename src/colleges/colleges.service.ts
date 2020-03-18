import { Injectable } from '@nestjs/common'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { College } from './college.entity'
import { CollegeInterface } from './interfaces/college.interface'
import { User } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { Like } from 'typeorm'

@Injectable()
export class CollegesService {
  async create(
    createCollegeDto: CreateCollegeDto,
    user: User,
  ): Promise<CollegeInterface> {
    const college = await College.create({
      ...createCollegeDto,
      creator: user,
    }).save()

    return {
      ...college,
      creator: user.id,
    }
  }

  async findOne(id: number): Promise<CollegeInterface> {
    const college = await College.findOne({
      where: {
        id,
      },
      loadRelationIds: true,
    })

    return {
      ...college,
      creator: college.creator.id,
    }
  }

  async findAll(
    filterCollegeDto: FilterCollegeDto,
  ): Promise<CollegeInterface[]> {
    const filterLike: { [k: string]: any } = {}

    for (const filter in filterCollegeDto) {
      filterLike[filter] = Like(`%${filterCollegeDto[filter]}%`)
    }

    const colleges = await College.find({
      where: {
        ...filterLike,
      },
      loadRelationIds: true,
    })

    return colleges.map<CollegeInterface>(college => {
      return {
        ...college,
        creator: college.creator.id,
      }
    })
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
