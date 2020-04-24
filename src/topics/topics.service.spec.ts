import { Test, TestingModule } from '@nestjs/testing'
import { topicsService } from './topics.service'

describe('topicsService', () => {
  let service: topicsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [topicsService],
    }).compile()

    service = module.get<topicsService>(topicsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
