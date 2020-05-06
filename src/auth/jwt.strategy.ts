import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstrant } from './constants/jwt.constant.js'
import { TokenInterface } from './interfaces/token.interface'
import { User } from '../users/user.entity'
import { UserRolesType } from '../enums/userRolesType'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstrant.secret,
    })
  }

  async validate(
    payload: TokenInterface,
  ): Promise<{ user: User; roles: UserRolesType[] }> {
    return { user: payload.user, roles: payload.roles }
  }
}
