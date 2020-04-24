import { Injectable } from '@nestjs/common'
import { CreateLevelDto } from './dto/createLevel.dto'
import { Test } from '../tests/test.entity'
import { Level } from './level.entity'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'

@Injectable()
export class LevelsService {
  async create(createLevelDto: CreateLevelDto, test: Test): Promise<Level> {
    try {
      const level = await Level.create({
        ...createLevelDto,
        test,
      }).save()

      return await this.findOne(level.id)
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

  async findOne(id: number): Promise<Level> {
    const level = await Level.findOne({
      where: {
        id,
      },
      relations: ['test', 'tasks'],
    })

    if (!level) {
      throw new BadRequestExceptionError({
        property: 'levelId',
        value: id,
        constraints: {
          isNotExist: 'level is not exist',
        },
      })
    }

    return level
  }
}
