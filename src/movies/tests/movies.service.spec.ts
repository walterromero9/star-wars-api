import { Test, TestingModule } from '@nestjs/testing'
import { MoviesService } from '../movies.service'
import { PrismaService } from '../../prisma.service'
import { StarwarsService } from '../../starwars/starwars.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'

describe('MoviesService', () => {
  let service: MoviesService
  let prismaService: PrismaService
  let starwarsService: StarwarsService

  const mockPrismaService = {
    movie: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  const mockStarwarsService = {
    getFilms: jest.fn(),
    getFilmById: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StarwarsService, useValue: mockStarwarsService },
      ],
    }).compile()

    service = module.get<MoviesService>(MoviesService)
    prismaService = module.get<PrismaService>(PrismaService)
    starwarsService = module.get<StarwarsService>(StarwarsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto = {
        title: 'Test Movie',
        episode_id: 1,
        opening_crawl: 'Test opening crawl',
        director: 'Test Director',
        producer: 'Test Producer',
        release_date: '2023-01-01',
      }
      
      mockPrismaService.movie.findFirst.mockResolvedValue(null)
      mockPrismaService.movie.create.mockResolvedValue({
        id: 'movie-id',
        ...createMovieDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await service.create(createMovieDto)

      expect(mockPrismaService.movie.findFirst).toHaveBeenCalledWith({
        where: { episode_id: createMovieDto.episode_id },
      })
      expect(mockPrismaService.movie.create).toHaveBeenCalledWith({
        data: createMovieDto,
      })
      expect(result).toHaveProperty('id')
      expect(result.title).toBe(createMovieDto.title)
    })

    it('should throw BadRequestException when movie already exists', async () => {
      const createMovieDto = {
        title: 'Test Movie',
        episode_id: 1,
        opening_crawl: 'Test opening crawl',
        director: 'Test Director',
        producer: 'Test Producer',
        release_date: '2023-01-01',
      }
      
      mockPrismaService.movie.findFirst.mockResolvedValue({
        id: 'existing-movie-id',
        ...createMovieDto,
      })

      await expect(service.create(createMovieDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [
        { id: '1', title: 'Movie 1', episode_id: 1 },
        { id: '2', title: 'Movie 2', episode_id: 2 },
      ]
      mockPrismaService.movie.findMany.mockResolvedValue(movies)

      const result = await service.findAll()

      expect(mockPrismaService.movie.findMany).toHaveBeenCalled()
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
      mockPrismaService.movie.findUnique.mockResolvedValue(movie)

      const result = await service.findOne(movieId)

      expect(mockPrismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: movieId },
      })
      expect(result).toEqual(movie)
    })

    it('should throw NotFoundException when movie is not found', async () => {
      const movieId = 'nonexistent-id'
      mockPrismaService.movie.findUnique.mockResolvedValue(null)

      await expect(service.findOne(movieId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a movie', async () => {
      const movieId = 'movie-id'
      const updateMovieDto = {
        title: 'Updated Movie Title',
        episode_id: 1,
        opening_crawl: 'Updated opening crawl',
        director: 'Updated Director',
        producer: 'Updated Producer',
        release_date: '2023-01-01'
      } as any
      
      const existingMovie = {
        id: movieId,
        title: 'Original Title',
        episode_id: 1,
        opening_crawl: 'Original crawl',
        director: 'Original Director',
        producer: 'Original Producer',
        release_date: '2023-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const updatedMovie = {
        ...existingMovie,
        ...updateMovieDto,
        updatedAt: new Date(),
      }
      
      mockPrismaService.movie.findUnique.mockResolvedValue(existingMovie)
      mockPrismaService.movie.update.mockResolvedValue(updatedMovie)

      const result = await service.update(movieId, updateMovieDto)

      expect(mockPrismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: movieId },
      })
      expect(mockPrismaService.movie.update).toHaveBeenCalledWith({
        where: { id: movieId.toString() },
        data: { ...updateMovieDto },
      })
      expect(result).toEqual(updatedMovie)
    })
  })

  describe('remove', () => {
    it('should delete a movie', async () => {
      const movieId = 'movie-id'
      const movie = { 
        id: movieId, 
        title: 'Test Movie',
        episode_id: 1,
      }
      
      mockPrismaService.movie.findUnique.mockResolvedValue(movie)
      mockPrismaService.movie.delete.mockResolvedValue(movie)

      const result = await service.remove(movieId)

      expect(mockPrismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: movieId },
      })
      expect(mockPrismaService.movie.delete).toHaveBeenCalledWith({
        where: { id: movieId },
      })
      expect(result).toEqual({
        message: 'Movie deleted successfully',
        movie: movie,
      })
    })

    it('should throw NotFoundException when movie to delete is not found', async () => {
      const movieId = 'nonexistent-id'
      mockPrismaService.movie.findUnique.mockResolvedValue(null)

      await expect(service.remove(movieId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('syncronizeMovies', () => {
    it('should synchronize movies from external API', async () => {
      const apiMovies = {
        results: [
          {
            title: 'Movie 1',
            episode_id: 1,
            opening_crawl: 'Opening 1',
            director: 'Director 1',
            producer: 'Producer 1',
            release_date: '2023-01-01',
          },
          {
            title: 'Movie 2',
            episode_id: 2,
            opening_crawl: 'Opening 2',
            director: 'Director 2',
            producer: 'Producer 2',
            release_date: '2023-02-01',
          },
        ],
      }
      
      mockStarwarsService.getFilms.mockResolvedValue(apiMovies)
      
      mockPrismaService.movie.findFirst.mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existing-movie-id',
          title: 'Movie 2',
          episode_id: 2,
        })

      await service.syncronizeMovies()

      expect(mockStarwarsService.getFilms).toHaveBeenCalled()
      expect(mockPrismaService.movie.findFirst).toHaveBeenCalledTimes(2)
      expect(mockPrismaService.movie.create).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.movie.create).toHaveBeenCalledWith({
        data: {
          title: apiMovies.results[0].title,
          episode_id: apiMovies.results[0].episode_id,
          opening_crawl: apiMovies.results[0].opening_crawl,
          director: apiMovies.results[0].director,
          producer: apiMovies.results[0].producer,
          release_date: apiMovies.results[0].release_date,
        }
      })
    })

    it('should throw NotFoundException when API call fails', async () => {
      mockStarwarsService.getFilms.mockRejectedValue(new Error('API Error'))
      await expect(service.syncronizeMovies()).rejects.toThrow(NotFoundException)
    })

    it('should throw NotFoundException when API returns no results', async () => {
      mockStarwarsService.getFilms.mockResolvedValue({ results: null })
      await expect(service.syncronizeMovies()).rejects.toThrow(NotFoundException)
    })
  })

  describe('cronJobMovies', () => {
    it('should call syncronizeMovies', async () => {
      jest.spyOn(service, 'syncronizeMovies').mockResolvedValue(undefined)
      await service.cronJobMovies()
      expect(service.syncronizeMovies).toHaveBeenCalled()
    })
  })
})
