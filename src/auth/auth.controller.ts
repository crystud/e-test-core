import { Body, Controller, Post } from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { AuthService } from './auth.service'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refreshToken(
    @Body() { token }: RefreshTokenDto,
  ): Promise<TokensInterface> {
    return await this.authService.refresh(token)
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto): Promise<TokensInterface> {
    return await this.authService.login(email, password)
  }
}
