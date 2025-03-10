import { Test, TestingModule } from '@nestjs/testing'
import { StarwarsController } from '../starwars.controller'
import { StarwarsService } from '../starwars.service'

describe('StarwarsController', () => {
  let controller: StarwarsController
  let starwarsService: StarwarsService

  const mockStarwarsService = {
    getFilms: jest.fn(),
    getFilmById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarwarsController],
      providers: [
        {
          provide: StarwarsService,
          useValue: mockStarwarsService,
        },
      ],
    }).compile()

    controller = module.get<StarwarsController>(StarwarsController)
    starwarsService = module.get<StarwarsService>(StarwarsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getFilms', () => {
    it('should return films from the service', async () => {
      const mockFilms = {
        count: 6,
        results: [
          { title: 'A New Hope', episode_id: 4 },
          { title: 'The Empire Strikes Back', episode_id: 5 },
        ],
      }
      mockStarwarsService.getFilms.mockResolvedValue(mockFilms)
      const result = await controller.getFilms()
      expect(starwarsService.getFilms).toHaveBeenCalled()
      expect(result).toEqual(mockFilms)
    })
  })

  describe('getFilmById', () => {
    it('should return a film by id', async () => {
      const filmId = '1'
      const mockFilm = { title: 'A New Hope', episode_id: 4 }
      mockStarwarsService.getFilmById.mockResolvedValue(mockFilm)
      const result = await controller.getFilmById(filmId)
      expect(starwarsService.getFilmById).toHaveBeenCalledWith(filmId)
      expect(result).toEqual(mockFilm)
    })
  })
})
