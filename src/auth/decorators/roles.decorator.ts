import { SetMetadata } from '@nestjs/common'
import { UserRolesType } from '../../enums/userRolesType'

export const Roles = (...roles: UserRolesType[]) => SetMetadata('roles', roles)
