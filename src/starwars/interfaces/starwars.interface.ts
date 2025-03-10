export interface SwapiFilmResponse {
    count: number
    next: string | null
    previous: string | null
    results: SwapiFilm[]
  }
  
  export interface SwapiFilm {
    title: string
    episode_id: number
    opening_crawl: string
    director: string
    producer: string
    release_date: string
  }