import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { API_ENDPOINTS } from '../common/constants/api.constants'
import { SwapiFilmResponse } from './interfaces/starwars.interface'

@Injectable()
export class StarwarsService {
    private readonly apiUrl = API_ENDPOINTS.SWAPI.BASE_URL

    constructor(private readonly httpService: HttpService) {}

    async getFilms(): Promise<SwapiFilmResponse> {
        const response = await firstValueFrom(this.httpService.get<SwapiFilmResponse>(`${this.apiUrl}${API_ENDPOINTS.SWAPI.FILMS}`))
        return response.data
    }

    async getFilmById(id: string) {
        const response = await firstValueFrom(this.httpService.get(`${this.apiUrl}${API_ENDPOINTS.SWAPI.FILMS}/${id}`))
        return response.data
    }
}