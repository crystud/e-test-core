import { BadRequestException, Injectable } from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { User } from '../users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.entity'
import { classToClass } from 'class-transformer'
import { compare } from 'bcryptjs'
import { AccessLevelType } from '../enums/accessLevelType'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string): Promise<TokensInterface> {
    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new BadRequestException()
    }

    const passwordIsCorrect = await compare(password, user.password)

    if (!passwordIsCorrect) {
      throw new BadRequestException()
    }

    return await this.createTokens(
      classToClass(user, {
        groups: [AccessLevelType.TOKEN],
      }),
    )
  }

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
      throw new BadRequestException()
    }

    refreshToken.active = false
    await refreshToken.save()

    const user = classToClass(refreshToken.user, {
      groups: [AccessLevelType.TOKEN],
    })

    return await this.createTokens(user)
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
