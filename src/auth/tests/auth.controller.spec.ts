import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { RegisterAuthDto } from '../dto/register.dto'
import { LoginAuthDto } from '../dto/login.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    create: jest.fn(),
    login: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterAuthDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }
      const expectedResponse = {
        message: 'User created successfully',
        userId: 'user-id',
      }
      mockAuthService.create.mockResolvedValue(expectedResponse)

      const result = await controller.create(registerDto)

      expect(authService.create).toHaveBeenCalledWith(registerDto)
      expect(result).toEqual(expectedResponse)
    })
  })

  describe('login', () => {
    it('should login and return access token', async () => {

      const loginDto: LoginAuthDto = {
        email: 'test@example.com',
        password: 'password123',
      }
      const expectedResponse = {
        access_token: 'jwt-token',
      }
      mockAuthService.login.mockResolvedValue(expectedResponse)

      const result = await controller.login(loginDto)

      expect(authService.login).toHaveBeenCalledWith(loginDto)
      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ]
      mockAuthService.findAll.mockResolvedValue(users)

      const result = await controller.findAll()

      expect(authService.findAll).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'user-id'
      const user = { id: userId, name: 'Test User', email: 'test@example.com' }
      mockAuthService.findOne.mockResolvedValue(user)

      const result = await controller.findOne(userId)

      expect(authService.findOne).toHaveBeenCalledWith(userId)
      expect(result).toEqual(user)
    })
  })
})
