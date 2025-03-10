import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'The movie has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. The movie may already exist.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. The user is not authorized to create a movie.' })
  @ApiResponse({ status: 403, description: 'Forbidden. The user is not admin.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'The list of movies has been successfully retrieved.' })
  findAll() {
    return this.moviesService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'The movie has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Not Found. The movie with the given ID does not exist.' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'The movie has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not Found. The movie with the given ID does not exist.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. The user is not authorized to update a movie.' })
  @ApiResponse({ status: 403, description: 'Forbidden. The user is not admin.' })
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'The movie has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found. The movie with the given ID does not exist.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. The user is not authorized to delete a movie.' })
  @ApiResponse({ status: 403, description: 'Forbidden. The user is not admin.' })
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id)
  }
}
