import { Injectable } from '@nestjs/common'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { College } from './college.entity'
import { CollegeInterface } from './interfaces/college.interface'
import { User } from '../users/user.entity'

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
}
