import { PartialType } from '@nestjs/mapped-types'
import { RegisterAuthDto } from './register.dto'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
    @IsEmail()
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty({description: 'Email of the user', example: 'luke@starwars.com'})
    email: string
    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    @ApiProperty({description: 'Password of the user', example: 'Skywalker123'})
    password: string
}