import { Test, TestingModule } from '@nestjs/testing'
import { topicsController } from './topics.controller'

describe('topics Controller', () => {
  let controller: topicsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [topicsController],
    }).compile()

    controller = module.get<topicsController>(topicsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
