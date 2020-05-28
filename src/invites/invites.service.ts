import { Injectable } from '@nestjs/common'
import { Invite } from './invite.entity'
import { Group } from '../groups/group.entity'
import { User } from '../users/user.entity'
import { getConnection } from 'typeorm'
import { Student } from '../students/student.entity'

@Injectable()
export class InvitesService {
  async create(
    firstName: string,
    lastName: string,
    patronymic: string,
    scoringBook: number,
    group: Group,
  ): Promise<Invite> {
    await getConnection().transaction(async transactionalEntityManager => {
      let user = User.create({
        firstName,
        lastName,
        patronymic,
        email: null,
        password: null,
      })

      user = await transactionalEntityManager.save(user)

      let student = Student.create({
        user,
        group,
        scoringBook,
      })

      student = await transactionalEntityManager.save(student)
    })

    return null
  }
}
