export interface Movie {
    id: string
    title: string
    episode_id: number
    opening_crawl: string
    director: string
    producer: string
    release_date: Date | String
    createdAt: Date
    userId?: string | null
  }