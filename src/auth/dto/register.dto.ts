import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator'

export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    @ApiProperty({description: 'Name of the user', example: 'Luke Skywalker'})
    name: string
    @IsEmail()
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty({description: 'Email of the user', example: 'luke@starwars.com'})
    email: string
    @IsString()
    @MinLength(8)
    @IsNotEmpty({message: 'Password is required'})
    @ApiProperty({description: 'Password of the user', example: 'Skywalker123'})
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
      })
    password: string

}
