import { PartialType } from '@nestjs/mapped-types'
import { CreateMovieDto } from './create-movie.dto'
import { IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'


export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'Episode ID of the movie', example: 5})
    episode_id: number
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'Title of the movie', example: 'The Empire Strikes Back'})
    title: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'Opening Crawl of the movie', example: 'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.'})
    opening_crawl: string
    @IsString()
    @IsNotEmpty()
    release_date: string
    @IsNotEmpty()
    @IsString()
    updatedAt: string
}
