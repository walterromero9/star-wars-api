export const API_ENDPOINTS = {
    SWAPI: {
      BASE_URL: 'https://swapi.dev/api',
      FILMS: '/films',
    },
  }

  export type ApiEndpoint = keyof typeof API_ENDPOINTS