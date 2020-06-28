import { Injectable } from '@nestjs/common'
import { User } from '../users/user.entity'
import { Admin } from './admin.entity'

@Injectable()
export class AdminsService {
  async create(user: User): Promise<Admin> {
    return Admin.create({
      user,
    })
  }
}
