import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SubjectsService } from './subjects.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../users/user.entity'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Subject } from './subject.entity'
import { CreateSubjectDto } from './dto/createSubject.dto'
import { FilterSubjectDto } from './dto/filterSubject.dto'

@ApiTags('colleges')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterSubjectDto: FilterSubjectDto,
  ): Promise<Subject[]> {
    return await this.subjectsService.findAll(filterSubjectDto)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:id')
  async confirm(@Param('id') id: number): Promise<Subject> {
    return await this.subjectsService.confirm(id)
  }
}
