import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { PrismaService } from '../prisma.service'
import { StarwarsService } from '../starwars/starwars.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [MoviesController],
  providers: [MoviesService, PrismaService, StarwarsService],
})
export class MoviesModule {}
