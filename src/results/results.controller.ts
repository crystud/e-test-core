import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { classToClass } from 'class-transformer'
import { Result } from './result.entity'
import { ResultsService } from './results.service'
import { FindByIdsDto } from './dto/findByIds.dto'

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Result,
    description: 'Find the result by id.',
  })
  async findOne(
    @Param('id') resultId: number,
    @Request() req,
  ): Promise<Result> {
    const result = await this.resultsService.findOne(resultId)

    return classToClass(result, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':ids/ids')
  @ApiOkResponse({
    type: Result,
    description: 'Find the result by id.',
  })
  async findByIds(
    @Query() findByIdsDto: FindByIdsDto,
    @Request() req,
  ): Promise<Result[]> {
    const results = await this.resultsService.findByIds(findByIdsDto.ids)

    return classToClass(results, {
      groups: [...req.user.roles],
    })
  }
}
