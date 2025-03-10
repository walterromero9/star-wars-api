import { BadRequestException, Injectable, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { PrismaService } from '../prisma.service'
import { Role } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginResponse, RegisterResponse } from './interfaces/auth.interface'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { ApiBearerAuth } from '@nestjs/swagger'


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async create(registerAuthDto: RegisterAuthDto ): Promise<RegisterResponse> {
    const findUser = await this.prisma.user.findUnique({
      where: { email: registerAuthDto.email },
    })
    if(findUser) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10)
    const user = await this.prisma.user.create({
      data: {...registerAuthDto, password: hashedPassword, role: Role.USER},
    })

    return {
      message: 'User created successfully',
      userId: user.id
    }

  }

  async login(loginAuthDto: LoginAuthDto ): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    })

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user?.password || '')

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  findAll() {
    return this.prisma.user.findMany()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }


}
