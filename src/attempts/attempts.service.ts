import { BadRequestException, Injectable } from '@nestjs/common'
import { Attempt } from './attempt.entity'
import { Ticket } from '../tickets/ticket.entity'

@Injectable()
export class AttemptsService {
  async create(ticket: Ticket): Promise<Attempt> {
    // TODO: add transaction
    if (ticket._used) throw new BadRequestException('Всі спроби вичерпано')
    if (ticket._outstanding) throw new BadRequestException('Час вичерпано')

    return null
  }
}
