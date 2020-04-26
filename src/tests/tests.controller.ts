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
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Test } from './test.entity'
import { CreateTestDto } from './dto/createTest.dto'
import { TestsService } from './tests.service'
import { SubjectsService } from '../subjects/subjects.service'
import { ShareToCollegeDto } from './dto/shareToCollege.dto'
import { CollegesService } from '../colleges/colleges.service'
import { UserRolesType } from '../enums/userRolesType'
import { classToClass } from 'class-transformer'

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly subjectsService: SubjectsService,
    private readonly collegesService: CollegesService,
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

    const test = await this.testsService.create(
      createTestDto,
      subject,
      req.user,
    )

    return classToClass(test, {
      groups: [...req.user.roles],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<Test> {
    const test = await this.testsService.findOne(id)

    if (this.testsService.hasAccess(test, req.user)) {
      return classToClass(test, {
        groups: [...req.user.roles],
      })
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post(':test/share/college')
  async shareToCollege(
    @Param('test') testId: number,
    @Body() shareToCollegeDto: ShareToCollegeDto,
    @Request() req,
  ): Promise<Test> {
    const [test, college] = await Promise.all([
      this.testsService.findOne(testId),
      this.collegesService.findOne(testId),
    ])

    if (this.testsService.hasAccess(test, req.user)) {
      const shaderedTest = await this.testsService.shareToCollage(test, college)

      return classToClass(shaderedTest, {
        groups: [...req.user.roles],
      })
    }

    throw new ForbiddenException()
  }
}
