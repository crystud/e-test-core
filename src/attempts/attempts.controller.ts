import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AttemptsService } from './attempts.service'
import { Attempt } from './attempt.entity'
import { classToClass } from 'class-transformer'

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Attempt,
    description: 'Find the attempt by id.',
  })
  async findOne(
    @Param('id') attemptId: number,
    @Request() req,
  ): Promise<Attempt> {
    const attempt = await this.attemptsService.findOne(attemptId)
    const user = req.user
    const accesses = await this.attemptsService.accessRelations(attempt, user)

    return classToClass(attempt, {
      groups: [...user.roles, ...accesses],
    })
  }
}
