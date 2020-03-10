import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { AuthService } from './auth.service'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('refresh')
  async refreshToken(
    @Body() { token }: RefreshTokenDto,
  ): Promise<TokensInterface> {
    return await this.authService.refresh(token)
  }
}
