import { Injectable } from '@nestjs/common'
import { CreateTaskDto } from './dto/createTask.dto'
import { Task } from './task.entity'
import { Topic } from '../topics/topics.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@Injectable()
export class TasksService {
  async create(createTaskDto: CreateTaskDto, topic: Topic): Promise<Task> {
    try {
      const task = await Task.create({
        ...createTaskDto,
        topic,
      }).save()

      return await this.findOne(task.id)
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

  async findOne(id: number): Promise<Task> {
    const task = await Task.findOne({
      where: {
        id,
      },
      relations: ['topic'],
    })

    if (!task) {
      throw new BadRequestExceptionError({
        property: 'taskId',
        value: id,
        constraints: {
          isNotExist: 'task is not exist',
        },
      })
    }

    return task
  }
}
