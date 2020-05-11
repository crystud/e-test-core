import { BadRequestException, Injectable } from '@nestjs/common'
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
      .leftJoin('topic.tasks', 'tasks')
      .select([
        'topic.id',
        'topic.name',
        'subject.id',
        'subject.name',
        'tasks.id',
        'tasks.question',
        'tasks.type',
      ])
      .where('topic.id = :topicId ', { topicId })
      .getOne()
  }

  async findEntity(topicId: number): Promise<Topic> {
    const topic = await Topic.createQueryBuilder('topic')
      .select(['topic.id'])
      .where('topic.id = :topicId ', { topicId })
      .getOne()

    if (!topic) throw new BadRequestException('Тему не знайдено')

    return topic
  }
}
