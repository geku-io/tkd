import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsArenasService } from './tournaments_arenas.service';

describe('TournamentsArenasService', () => {
  let service: TournamentsArenasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentsArenasService],
    }).compile();

    service = module.get<TournamentsArenasService>(TournamentsArenasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
