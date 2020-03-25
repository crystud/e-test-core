import { Test, TestingModule } from '@nestjs/testing'
import { SpecialitysService } from './specialties.service'

describe('SpecialitysService', () => {
  let service: SpecialitysService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialitysService],
    }).compile()

    service = module.get<SpecialitysService>(SpecialitysService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
