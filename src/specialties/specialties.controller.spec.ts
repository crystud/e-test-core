import { Test, TestingModule } from '@nestjs/testing'
import { SpecialitysController } from './specialties.controller'

describe('Specialitys Controller', () => {
  let controller: SpecialitysController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialitysController],
    }).compile()

    controller = module.get<SpecialitysController>(SpecialitysController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
