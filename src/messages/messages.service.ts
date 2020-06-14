import { BadRequestException, Injectable } from '@nestjs/common'
import { Message } from './message.entity'
import { User } from '../users/user.entity'
import { Group } from '../groups/group.entity'
import { Student } from '../students/student.entity'

@Injectable()
export class MessagesService {
  async sendToGroups(
    sender: User,
    groups: Group[],
    messageText: string,
  ): Promise<Message> {
    const message = await Message.create({
      sender,
      groups,
      messageText,
    }).save()

    return await this.findOne(message.id)
  }

  async findOne(messageId: number): Promise<Message> {
    const message = await Message.createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.groups', 'groups')
      .leftJoin('groups.speciality', 'speciality')
      .select([
        'message.id',
        'message.messageText',
        'sender.id',
        'sender.firstName',
        'sender.patronymic',
        'sender.email',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'speciality.symbol',
        'speciality.yearOfStudy',
      ])
      .where('message.id = :messageId', { messageId })
      .getOne()

    if (!message) throw new BadRequestException('Повідомлення не знайдено')

    return message
  }

  async findSended(
    sender: User,
    limit: number,
    offset: number,
  ): Promise<Message[]> {
    return await Message.createQueryBuilder('messages')
      .leftJoin('messages.sender', 'sender')
      .leftJoin('messages.groups', 'groups')
      .leftJoin('groups.speciality', 'speciality')
      .select([
        'messages.id',
        'messages.messageText',
        'messages.createAt',
        'sender.id',
        'sender.firstName',
        'sender.lastName',
        'sender.patronymic',
        'sender.email',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'speciality.symbol',
        'speciality.yearOfStudy',
      ])
      .where('sender.id = :senderId', { senderId: sender.id })
      .limit(limit)
      .offset(offset)
      .orderBy('messages.createAt', 'DESC')
      .getMany()
  }

  async findByStudent(
    student: Student,
    limit: number,
    offset: number,
  ): Promise<Message[]> {
    return await Message.createQueryBuilder('messages')
      .leftJoin('messages.sender', 'sender')
      .leftJoin('messages.groups', 'groups')
      .leftJoin('groups.speciality', 'speciality')
      .select([
        'messages.id',
        'messages.messageText',
        'messages.createAt',
        'sender.id',
        'sender.firstName',
        'sender.lastName',
        'sender.patronymic',
        'sender.email',
        'groups.id',
        'groups.startYear',
        'groups.number',
        'speciality.symbol',
        'speciality.yearOfStudy',
      ])
      .where('groups.id = :groupsId', { groupsId: student.group.id })
      .limit(limit)
      .offset(offset)
      .orderBy('messages.createAt', 'DESC')
      .getMany()
  }
}
