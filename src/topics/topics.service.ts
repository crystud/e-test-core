import { Injectable } from '@nestjs/common'
import { CreateTopicDto } from './dto/createTopic.dto'
import { Topic } from './topic.entity'
import { Subject } from '../subject/subject.entity'

@Injectable()
export class TopicsService {
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    return await Topic.create({
      ...createTopicDto,
      subject: Subject.create({ id: createTopicDto.subject }),
    }).save()
  }

  async findOne(topicId: number): Promise<Topic> {
    return await Topic.createQueryBuilder('topic')
      .leftJoin('topic.subject', 'subject')
      .select(['topic.id', 'topic.name', 'subject.id', 'subject.name'])
      .where('topic.id = :topicId ', { topicId })
      .getOne()
  }
}
