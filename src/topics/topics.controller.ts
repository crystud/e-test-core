import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRolesType } from '../enums/userRolesType'
import { RolesGuard } from '../auth/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Topic } from './topics.entity'
import { CreateTopicDto } from './dto/createTopic.dto'
import { TopicsService } from './topics.service'
import { SubjectsService } from '../subjects/subjects.service'
import { classToClass } from 'class-transformer'
import { AccessLevelType } from '../enums/accessLevelType'

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly subjectsService: SubjectsService,
  ) {}

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    type: Topic,
    description: 'Create new topic',
  })
  async createTopic(
    @Body() createTopicDto: CreateTopicDto,
    @Request() req,
  ): Promise<Topic> {
    const subject = await this.subjectsService.findOne(createTopicDto.subject)

    const topic = await this.topicsService.create(
      createTopicDto,
      req.user,
      subject,
    )

    return classToClass(topic, {
      groups: [...req.user.roles, AccessLevelType.OWNER],
    })
  }

  @ApiBearerAuth()
  @Roles(UserRolesType.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    type: Topic,
    description: 'Find topic by id',
  })
  async findOne(@Param('id') topicId: number, @Request() req): Promise<Topic> {
    const topic = await this.topicsService.findOne(topicId)

    const accesses = await this.topicsService.accessRelations(topic, req.user)

    return classToClass(topic, {
      groups: [...req.user.roles, ...accesses],
    })
  }
}
