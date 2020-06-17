import { BadRequestException, Injectable } from '@nestjs/common'
import { TokensInterface } from './interfaces/tokens.interface'
import { User } from '../users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.entity'
import { classToClass } from 'class-transformer'
import { compare } from 'bcryptjs'
import { AccessLevelType } from '../enums/accessLevelType'
import { UserRolesType } from '../enums/userRolesType'

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
      throw new BadRequestException('Користувача не знайдено')
    }

    const passwordIsCorrect = await compare(password, user.password)

    if (!passwordIsCorrect) {
      throw new BadRequestException('Пароль не правильний')
    }

    return await this.createTokens(
      classToClass(user, {
        groups: [AccessLevelType.TOKEN],
      }),
    )
  }

  private async generateJWT(
    user: User,
    roles: UserRolesType[],
  ): Promise<string> {
    return this.jwtService.signAsync({
      user,
      roles,
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
    const [token, refreshToken] = await Promise.all([
      this.generateJWT(user, await this.generateRoles(user.id)),

      Token.create({
        user,
      }).save(),
    ])

    return {
      access: token,
      refresh: refreshToken.value,
    }
  }

  async generateRoles(userId: number): Promise<UserRolesType[]> {
    const roles: UserRolesType[] = [UserRolesType.USER]

    const user = await User.createQueryBuilder('user')
      .leftJoin('user.admin', 'admin')
      .leftJoin('user.students', 'students')
      .leftJoin('user.teachers', 'teachers')
      .select(['user.id', 'admin.id', 'students.id', 'teachers.id'])
      .where('user.id = :userId', { userId })
      .getOne()

    if (user.admin) roles.push(UserRolesType.ADMIN)
    if (user.students?.length) roles.push(UserRolesType.STUDENT)
    if (user.teachers?.length) roles.push(UserRolesType.TEACHER)

    return roles
  }
}
