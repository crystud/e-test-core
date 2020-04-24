import { Injectable } from '@nestjs/common'
import { CreateTopicDto } from './dto/createTopic.dto'
import { User } from '../users/user.entity'
import { Subject } from '../subjects/subject.entity'
import { Topic } from './topics.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { AccessLevelType } from '../enums/accessLevelType'

@Injectable()
export class TopicsService {
  async create(
    createTopicDto: CreateTopicDto,
    creator: User,
    subject: Subject,
  ): Promise<Topic> {
    try {
      const topic = await Topic.create({
        ...createTopicDto,
        creator,
        subject,
      }).save()

      return await this.findOne(topic.id)
    } catch (e) {
      if (e.name === 'QueryFailedError' && e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestExceptionError({
          property: 'field',
          value: '',
          constraints: {
            duplicate: e.message,
          },
        })
      }
    }
  }

  async findOne(id: number): Promise<Topic> {
    const topic = await Topic.findOne({
      where: {
        id,
      },
      relations: ['subject', 'creator'],
    })

    if (!topic) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'topic is not exist',
        },
      })
    }

    return topic
  }

  async isCreator(topic: Topic, user: User): Promise<boolean> {
    return topic.creator.id === user.id
  }

  async accessRelations(topic: Topic, user: User): Promise<AccessLevelType[]> {
    const levels: AccessLevelType[] = []

    const [isCreator] = await Promise.all([this.isCreator(topic, user)])

    if (isCreator) levels.push(AccessLevelType.OWNER)

    return levels
  }

  async confirm(topic: Topic): Promise<Topic> {
    topic.confirmed = true
    await topic.save()

    return await this.findOne(topic.id)
  }
}
