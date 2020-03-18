import { Injectable } from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { User } from '../users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.entity'
import { BadRequestExceptionError } from '../tools/BadRequestExceptionError'
import { classToClass } from 'class-transformer'
import { compare } from 'bcryptjs'

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
      throw new BadRequestExceptionError({
        property: 'email',
        value: email,
        constraints: {
          isNotExist: 'There`s not user with this email',
        },
      })
    }

    if (await compare(password, user.password)) {
      throw new BadRequestExceptionError({
        property: 'password',
        value: password,
        constraints: {
          isNotExist: 'password is incorrect',
        },
      })
    }

    return await this.createTokens(classToClass(user))
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

    const user = classToClass(refreshToken.user)

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
