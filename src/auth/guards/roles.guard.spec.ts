import { Test, TestingModule } from '@nestjs/testing'
import { RolesGuard } from './roles.guard'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Role } from '@prisma/client'

describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: Reflector
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile()

    guard = module.get<RolesGuard>(RolesGuard)
    reflector = module.get<Reflector>(Reflector)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn(),
      } as unknown as ExecutionContext

      jest.spyOn(reflector, 'get').mockReturnValue(null)

      const result = guard.canActivate(mockExecutionContext)

      expect(result).toBe(true)
      expect(reflector.get).toHaveBeenCalledWith('roles', mockExecutionContext.getHandler())
    })

    it('should return true when user has the required role', () => {
      const mockRequest = {
        user: {
          userId: 'user-id',
          email: 'test@example.com',
          role: Role.ADMIN,
        },
      }

      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      } as unknown as ExecutionContext

      jest.spyOn(reflector, 'get').mockReturnValue([Role.ADMIN])

      const result = guard.canActivate(mockExecutionContext)

      expect(result).toBe(true)
      expect(reflector.get).toHaveBeenCalledWith('roles', mockExecutionContext.getHandler())
    })

    it('should throw ForbiddenException when user does not have the required role', () => {
      const mockRequest = {
        user: {
          userId: 'user-id',
          email: 'test@example.com',
          role: Role.USER,
        },
      }

      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      jest.spyOn(reflector, 'get').mockReturnValue([Role.ADMIN])

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException)
      expect(reflector.get).toHaveBeenCalledWith('roles', mockExecutionContext.getHandler())
    })

    it('should throw ForbiddenException when user is not defined', () => {
      const mockRequest = {}

      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      jest.spyOn(reflector, 'get').mockReturnValue([Role.ADMIN])

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException)
      expect(reflector.get).toHaveBeenCalledWith('roles', mockExecutionContext.getHandler())
    })
    
    it('should throw ForbiddenException with custom message about permissions', () => {
      const mockRequest = {
        user: {
          userId: 'user-id',
          email: 'test@example.com',
          role: Role.USER,
        },
      }

      const mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext

      jest.spyOn(reflector, 'get').mockReturnValue([Role.ADMIN])

      try {
        guard.canActivate(mockExecutionContext)
        fail('Expected ForbiddenException to be thrown')
      } catch (error) {
        if (error instanceof ForbiddenException) {
          expect(error.message).toContain('permission')
        } else {
          fail('Expected ForbiddenException but got different error')
        }
      }
    })
  })
}) 