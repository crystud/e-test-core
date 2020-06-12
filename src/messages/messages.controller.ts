import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Body,
  Get,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import { Message } from './message.entity'
import { MessagesService } from './messages.service'
import { GroupsService } from '../groups/groups.service'
import { SendToGroupsDto } from './dto/sendToGroups.dto'
import { FindSendedDto } from './dto/findSended.dto'
import { FindByStudentDto } from './dto/findByStudent.dto'
import { StudentsService } from '../students/students.service'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly groupsService: GroupsService,
    private readonly studentsService: StudentsService,
  ) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('sendToGroups')
  async createMany(
    @Body() sendToGroupsDto: SendToGroupsDto,
    @Request() { user: { user } },
  ): Promise<Message> {
    const groups = await this.groupsService.findEntityByIds(
      sendToGroupsDto.groups,
    )

    return await this.messagesService.sendToGroups(
      user,
      groups,
      sendToGroupsDto.messageText,
    )
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.ADMIN, UserRolesType.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('sended')
  async getSended(
    @Query() findSendedDto: FindSendedDto,
    @Request() { user: { user } },
  ): Promise<Message[]> {
    return await this.messagesService.findSended(
      user,
      findSendedDto.limit,
      findSendedDto.offset,
    )
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRolesType.STUDENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('findByStudent')
  async findByStudent(
    @Query() findByStudentDto: FindByStudentDto,
  ): Promise<Message[]> {
    // TODO: add access check
    const student = await this.studentsService.findEntity(
      findByStudentDto.student,
    )

    return await this.messagesService.findByStudent(
      student,
      findByStudentDto.limit,
      findByStudentDto.offset,
    )
  }
}
