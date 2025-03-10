import { Test } from '@nestjs/testing'
import { StarwarsModule } from '../starwars.module'
import { StarwarsService } from '../starwars.service'
import { StarwarsController } from '../starwars.controller'
import { ConfigModule } from '@nestjs/config'

describe('StarwarsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        StarwarsModule,
      ],
    }).compile()

    expect(module).toBeDefined()
    expect(module.get(StarwarsService)).toBeDefined()
    expect(module.get(StarwarsController)).toBeDefined()
  })

  it('should import HttpModule for API calls', async () => {
    const module = await Test.createTestingModule({
      imports: [StarwarsModule],
    }).compile()

    const starwarsService = module.get(StarwarsService)
    expect(starwarsService).toBeInstanceOf(StarwarsService)
  })
}) 