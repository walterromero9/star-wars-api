import { Test, TestingModule } from '@nestjs/testing'
import { StarwarsService } from '../starwars.service'
import { HttpService } from '@nestjs/axios'
import { of } from 'rxjs'
import { API_ENDPOINTS } from '../../common/constants/api.constants'
import { AxiosResponse } from 'axios'

describe('StarwarsService', () => {
  let service: StarwarsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarwarsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<StarwarsService>(StarwarsService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getFilms', () => {
    it('should return films data from the API', async () => {
      const mockFilmsResponse = {
        count: 6,
        results: [
          {
            title: 'A New Hope',
            episode_id: 4,
            director: 'George Lucas',
            release_date: '1977-05-25',
          },
          {
            title: 'The Empire Strikes Back',
            episode_id: 5,
            director: 'Irvin Kershner',
            release_date: '1980-05-17',
          },
        ],
      }

      const mockResponse: AxiosResponse = {
        data: mockFilmsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      }

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse))
      const result = await service.getFilms()
      expect(httpService.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.SWAPI.BASE_URL}${API_ENDPOINTS.SWAPI.FILMS}`
      )
      expect(result).toEqual(mockFilmsResponse)
    })
  })

  describe('getFilmById', () => {
    it('should return a single film by ID', async () => {
      const filmId = '1'
      const mockFilmResponse = {
        title: 'A New Hope',
        episode_id: 4,
        director: 'George Lucas',
        release_date: '1977-05-25',
      }

      const mockResponse: AxiosResponse = {
        data: mockFilmResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      }

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse))
      const result = await service.getFilmById(filmId)
      expect(httpService.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.SWAPI.BASE_URL}${API_ENDPOINTS.SWAPI.FILMS}/${filmId}`
      )
      expect(result).toEqual(mockFilmResponse)
    })
  })
})
