import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './prisma.service'
import { PrismaClient } from '@prisma/client'

class MockPrismaService extends PrismaService {
  $connect = jest.fn().mockResolvedValue(undefined)
  $disconnect = jest.fn().mockResolvedValue(undefined)
}

describe('PrismaService', () => {
  let service: MockPrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        }
      ],
    }).compile()

    service = module.get<MockPrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      await service.onModuleInit()
      expect(service.$connect).toHaveBeenCalled()
    })
  })

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      await service.onModuleDestroy()
      expect(service.$disconnect).toHaveBeenCalled()
    })
  })
}) 