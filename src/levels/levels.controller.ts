import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Level } from './level.entity'
import { LevelsService } from './levels.service'
import { TestsService } from '../tests/tests.service'
import { CreateLevelDto } from './dto/createLevel.dto'
import { classToClass } from 'class-transformer'

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly testsService: TestsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Level,
    description: 'Add new level to test',
  })
  async create(
    @Body() createLevelDto: CreateLevelDto,
    @Request() req,
  ): Promise<Level> {
    const test = await this.testsService.findOne(createLevelDto.test)

    const level = await this.levelsService.create(createLevelDto, test)

    return classToClass(level, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiCreatedResponse({
    type: Level,
    description: 'Find level by id',
  })
  async findOne(@Param('id') levelId: number, @Request() req): Promise<Level> {
    const level = await this.levelsService.findOne(levelId)

    return classToClass(level, {
      groups: [...req.user.roles],
    })
  }
}
