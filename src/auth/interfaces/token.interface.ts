import { User } from '../../users/user.entity'
import { UserRolesType } from '../../enums/userRolesType'

export interface TokenInterface {
  user: User
  roles: UserRolesType[]
}
