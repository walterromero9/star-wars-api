import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { PrismaService } from '../prisma.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { StarwarsService } from '../starwars/starwars.service'
import { Movie } from './interfaces/movies.interfaces'
@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService, private readonly starwarsService: StarwarsService) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.prisma.movie.findFirst({
      where: { episode_id: createMovieDto.episode_id },
    })

    if(existingMovie) {
      throw new BadRequestException('Movie already exists')
    }

    return this.prisma.movie.create({
      data: createMovieDto,
    })
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany()
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: id },
    }) 
    if(!movie) {
      throw new NotFoundException('Movie not found')
    }
    return movie
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: id.toString() },
    })
    if(!movie) {
      throw new NotFoundException('Movie not found')
    }
    return this.prisma.movie.update({
      where: { id: id.toString() },
      data: {
        ...updateMovieDto,
      },
    })
  }

 async remove(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: {id: id}
    })
    if(!movie) {
      throw new NotFoundException('Movie not found')
    } 

    await this.prisma.movie.delete({
      where: {id: id}
    })

    return {
      message: 'Movie deleted successfully',
      movie: movie,
    }
  }

  async onModuleInit() {
    await this.syncronizeMovies()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cronJobMovies() {
    await this.syncronizeMovies()
  }

  async syncronizeMovies() {
    try {
      const response = await this.starwarsService.getFilms()

      if(!response || !response.results ) {
        throw new Error('Error not movies found')
      }

      const movies = response.results

      await Promise.all(movies.map(async (movie) => {
        const existingMovie = await this.prisma.movie.findFirst({
          where: {
            episode_id: movie.episode_id,
          },
        })

        if(!existingMovie) {
          await this.prisma.movie.create({
            data: {
              title: movie.title,
              episode_id: movie.episode_id,
              opening_crawl: movie.opening_crawl,
              director: movie.director,
              producer: movie.producer,
              release_date: movie.release_date,
            }
          })
        }
      }))

    } catch (error) {
      throw new NotFoundException('Error syncronizing movies')
    } 
  }
}
