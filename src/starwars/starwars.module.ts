import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { StarwarsService } from './starwars.service'
import { StarwarsController } from './starwars.controller'

@Module({
    imports: [HttpModule],
    providers: [StarwarsService],
    controllers: [StarwarsController],
    exports: [StarwarsService],
})
export class StarwarsModule {}
