import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Ticket } from './ticket.entity'
import { TicketsService } from './tickets.service'
import { StudentsService } from '../students/students.service'

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly studentsService: StudentsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT, UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':ticketId')
  async findOne(@Param('ticketId') ticketId: number): Promise<Ticket> {
    // TODO: refactor check access
    return await this.ticketsService.findOne(ticketId)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT, UserRolesType.TEACHER, UserRolesType.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('findByStudent/:studentId')
  async findByStudent(
    @Param('studentId') studentId: number,
  ): Promise<Ticket[]> {
    const student = await this.studentsService.findOne(studentId)
    // TODO: refactor check access
    return await this.ticketsService.findByStudent(student)
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('activate/:ticketId')
  async activate(@Param('ticketId') ticketId: number): Promise<Ticket> {
    const ticket = await this.ticketsService.findEntity(ticketId)
    // TODO: refactor check access
    return await this.ticketsService.activate(ticket)
  }
}
