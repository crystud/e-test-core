import { Injectable } from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { User } from '../users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.entity'
import { BadRequestExceptionError } from '../tools/BadRequestExceptionError'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private async generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({
      user,
    })
  }

  async refresh(token: string): Promise<TokensInterface> {
    const refreshToken = await Token.findOne({
      where: {
        value: token,
        active: true,
      },
      relations: ['user'],
    })

    if (!refreshToken) {
      throw new BadRequestExceptionError({
        property: 'token',
        value: token,
        constraints: {
          isNotExist: 'token is incorrect',
        },
      })
    }

    refreshToken.active = false
    await refreshToken.save()

    return await this.createTokens(refreshToken.user)
  }

  async createTokens(user: User): Promise<TokensInterface> {
    const token = await this.generateJWT(user)

    const refreshToken = await Token.create({
      user,
    }).save()

    return {
      access: token,
      refresh: refreshToken.value,
    }
  }
}
