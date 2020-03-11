import { SetMetadata } from '@nestjs/common'
import { UserRolesType } from '../../users/user.entity'

export const Roles = (...roles: UserRolesType[]) => SetMetadata('roles', roles)
