import { Test } from '@nestjs/testing'
import { AuthModule } from '../auth.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '../auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

jest.mock('./strategies/jwt.strategy', () => {
  return {
    JwtStrategy: jest.fn().mockImplementation(() => ({
      validate: jest.fn()
    }))
  }
})

jest.mock('../prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn()
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn()
    }))
  }
})

describe('AuthModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
      ],
    }).compile()

    expect(module).toBeDefined()
    expect(module.get(AuthService)).toBeDefined()
  })

  it('should export JwtModule configured correctly', async () => {
    process.env.JWT_SECRET = 'test-secret-for-jwt'
    
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret')
    }
    
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    expect(module.get(JwtModule)).toBeDefined()
  })
}) 