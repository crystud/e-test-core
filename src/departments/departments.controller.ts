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
import { Department } from './department.entity'
import { CreateDepartmentDto } from './dto/createDepartment.dto'
import { CollegesService } from '../colleges/colleges.service'
import { DepartmentsService } from './departments.service'

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Request() req,
  ): Promise<Department> {
    const college = await this.collegesService.findOne(
      createDepartmentDto.college,
    )

    if (await this.collegesService.isCreator(college, req.user)) {
      return await this.departmentsService.create(createDepartmentDto, college)
    }

    throw new ForbiddenException()
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') departmentID: number,
    @Request() req,
  ): Promise<Department> {
    const department = await this.departmentsService.findOne(departmentID)

    if (await this.collegesService.hasAccess(department.college, req.user))
      return department

    throw new ForbiddenException()
  }
}
