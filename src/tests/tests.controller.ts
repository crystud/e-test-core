import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Test } from './test.entity'
import { CreateTestDto } from './dto/createTest.dto'
import { TestsService } from './tests.service'
import { SubjectsService } from '../subjects/subjects.service'

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly subjectsService: SubjectsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTestDto: CreateTestDto,
    @Request() req,
  ): Promise<Test> {
    const subject = await this.subjectsService.findOne(createTestDto.subject)

    return await this.testsService.create(createTestDto, subject, req.user)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<Test> {
    const test = await this.testsService.findOne(id)

    if (this.testsService.hasAccess(test, req.user)) {
      return test
    }

    throw new ForbiddenException()
  }
}
