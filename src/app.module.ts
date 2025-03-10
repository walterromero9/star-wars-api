import { Module } from '@nestjs/common'
import { MoviesModule } from './movies/movies.module'
import { AuthModule } from './auth/auth.module'
import { StarwarsModule } from './starwars/starwars.module'
import { StarwarsController } from './starwars/starwars.controller'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), MoviesModule, AuthModule, StarwarsModule],
  controllers: [StarwarsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
