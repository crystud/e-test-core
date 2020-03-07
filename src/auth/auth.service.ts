import { Injectable } from '@nestjs/common'
import { TokensDto } from './dto/tokens.dto'
import { User } from '../users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.entity'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private async generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({
      user,
    })
  }

  async createTokens(user: User): Promise<TokensDto> {
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
