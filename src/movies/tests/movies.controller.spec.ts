import { Test, TestingModule } from '@nestjs/testing'
import { MoviesController } from '../movies.controller'
import { MoviesService } from '../movies.service'
import { CreateMovieDto } from '../dto/create-movie.dto'
import { UpdateMovieDto } from '../dto/update-movie.dto'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}))

jest.mock('../auth/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}))

describe('MoviesController', () => {
  let controller: MoviesController
  let moviesService: MoviesService
  let jwtService: JwtService
  let reflector: Reflector

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    syncronizeMovies: jest.fn(),
  }

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  }

  const mockReflector = {
    get: jest.fn(),
    getAllAndOverride: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        JwtAuthGuard,
        RolesGuard,
      ],
    }).compile()

    controller = module.get<MoviesController>(MoviesController)
    moviesService = module.get<MoviesService>(MoviesService)
    jwtService = module.get<JwtService>(JwtService)
    reflector = module.get<Reflector>(Reflector)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        episode_id: 1,
        opening_crawl: 'Test opening crawl',
        director: 'Test Director',
        producer: 'Test Producer',
        release_date: '2023-01-01',
      }
      const createdMovie = {
        id: 'movie-id',
        ...createMovieDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockMoviesService.create.mockResolvedValue(createdMovie)
      const result = await controller.create(createMovieDto)
      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto)
      expect(result).toEqual(createdMovie)
    })
  })

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [
        { id: '1', title: 'Movie 1', episode_id: 1 },
        { id: '2', title: 'Movie 2', episode_id: 2 },
      ]
      mockMoviesService.findAll.mockResolvedValue(movies)
      const result = await controller.findAll()
      expect(moviesService.findAll).toHaveBeenCalled()
      expect(result).toEqual(movies)
    })
  })

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const movieId = 'movie-id'
      const movie = { 
        id: movieId, 
        title: 'Test Movie',
        episode_id: 1,
      }
      mockMoviesService.findOne.mockResolvedValue(movie)
      const result = await controller.findOne(movieId)
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId)
      expect(result).toEqual(movie)
    })
  })

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = 'movie-id'
      const updateMovieDto = {
        title: 'Updated Movie Title',
      } as UpdateMovieDto
      
      const updatedMovie = {
        id: movieId,
        title: updateMovieDto.title,
        episode_id: 1,
      }
      
      mockMoviesService.update.mockResolvedValue(updatedMovie)
      const result = await controller.update(movieId, updateMovieDto)
      expect(moviesService.update).toHaveBeenCalledWith(movieId, updateMovieDto)
      expect(result).toEqual(updatedMovie)
    })
  })

  describe('remove', () => {
    it('should delete a movie', async () => {
      const movieId = 'movie-id'
      const deleteResult = {
        message: 'Movie deleted successfully',
        movie: {
          id: movieId,
          title: 'Test Movie',
        },
      }
      
      mockMoviesService.remove.mockResolvedValue(deleteResult)
      const result = await controller.remove(movieId)
      expect(moviesService.remove).toHaveBeenCalledWith(movieId)
      expect(result).toEqual(deleteResult)
    })
  })
})
