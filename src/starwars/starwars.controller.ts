import { Controller, Get, Param } from '@nestjs/common'
import { StarwarsService } from './starwars.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Star Wars')
@Controller('starwars')
export class StarwarsController {
    constructor(private readonly starwarsService: StarwarsService) {}

    @Get('films')
    @ApiOperation({ summary: 'Get all films' })
    @ApiResponse({ status: 200, description: 'The list of films has been successfully retrieved.' })
    getFilms() {
        return this.starwarsService.getFilms()
    }

    @Get('films/:id')
    @ApiOperation({ summary: 'Get a film by ID' })
    @ApiResponse({ status: 200, description: 'The film has been successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Not Found. The film with the given ID does not exist.' })
    getFilmById(@Param('id') id: string) {
        return this.starwarsService.getFilmById(id)
    }
}