import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsInt, IsArray, IsEnum } from "class-validator"


export class CreateMovieDto {
    @IsString()
    @IsNotEmpty({message: 'Title is required'})
    @ApiProperty({description: 'Title of the movie', example: 'The Empire Strikes Back'})
    title: string

    @IsInt()
    @IsNotEmpty({message: 'Episode ID is required'})
    @ApiProperty({description: 'Episode ID of the movie', example: 5})
    episode_id: number

    @IsString()
    @IsNotEmpty({message: 'Opening Crawl is required'})
    @ApiProperty({description: 'Opening Crawl of the movie'})
    opening_crawl: string

    @IsString()
    @IsNotEmpty({message: 'Director is required'})
    @ApiProperty({description: 'Director of the movie', example: 'Irvin Kershner'})
    director: string

    @IsString()
    @IsNotEmpty({message: 'Producer is required'})
    @ApiProperty({description: 'Producer of the movie', example: 'Gary Kurtz, Rick McCallum'})
    producer: string

    @IsString()
    @IsNotEmpty({message: 'Release Date is required'})
    @ApiProperty({description: 'Release Date of the movie', example: '1980-05-17'})
    release_date: string
}
