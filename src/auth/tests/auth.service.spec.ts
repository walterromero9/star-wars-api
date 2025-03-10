import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { PrismaService } from '../../prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let prismaService: PrismaService
  let jwtService: JwtService

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  }

  const mockJwtService = {
    signAsync: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }
      const hashedPassword = 'hashedPassword123'
      const expectedUser = {
        id: 'user-id',
        ...registerDto,
        password: hashedPassword,
        role: Role.USER,
        createdAt: new Date(),
      }

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never)
      mockPrismaService.user.create.mockResolvedValue(expectedUser)

      const result = await service.create(registerDto)

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10)
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...registerDto, password: hashedPassword, role: Role.USER },
      })
      expect(result).toEqual({
        message: 'User created successfully',
        userId: expectedUser.id,
      })
    })
  })

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' }
      const user = {
        id: 'user-id',
        email: loginDto.email,
        password: 'hashedPassword',
        role: Role.USER,
      }
      const token = 'jwt-token'

      mockPrismaService.user.findUnique.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
      mockJwtService.signAsync.mockResolvedValue(token)

      const result = await service.login(loginDto)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, user.password)
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      })
      expect(result).toEqual({ access_token: token })
    })

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = { email: 'nonexistent@example.com', password: 'password123' }
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' }
      const user = {
        id: 'user-id',
        email: loginDto.email,
        password: 'hashedPassword',
        role: Role.USER,
      }

      mockPrismaService.user.findUnique.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ]
      mockPrismaService.user.findMany.mockResolvedValue(users)

      const result = await service.findAll()

      expect(mockPrismaService.user.findMany).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'user-id'
      const user = { id: userId, name: 'Test User', email: 'test@example.com' }
      mockPrismaService.user.findUnique.mockResolvedValue(user)

      const result = await service.findOne(userId)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(result).toEqual(user)
    })

    it('should return null when user is not found', async () => {
      const userId = 'nonexistent-id'
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      const result = await service.findOne(userId)

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      })
      expect(result).toBeNull()
    })
  })
})
