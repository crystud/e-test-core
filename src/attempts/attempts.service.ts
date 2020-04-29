import { Injectable } from '@nestjs/common'
import { Ticket } from '../tickets/ticket.entity'

import { Task } from '../tasks/task.entity'

@Injectable()
export class AttemptsService {
  async create(ticket: Ticket) {
    let levels = []

    ticket.permission.test.levels.forEach(level => {
      const countOfTask = level.countOfTask
      const request = Task.createQueryBuilder('task')
        .leftJoinAndSelect('task.levels', 'levels')
        .where('levels.id = :levelsID', { levelsID: level.id })
        .orderBy('RAND()')
        .limit(countOfTask)
        .getMany()

      levels = [...levels, request]
    })

    const [tasks] = await Promise.all(levels)

    global.console.log(tasks)
  }
}
