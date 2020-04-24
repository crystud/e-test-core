import { Test, TestingModule } from '@nestjs/testing'
import { LevelsController } from './levels.controller'

describe('Levels Controller', () => {
  let controller: LevelsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelsController],
    }).compile()

    controller = module.get<LevelsController>(LevelsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
