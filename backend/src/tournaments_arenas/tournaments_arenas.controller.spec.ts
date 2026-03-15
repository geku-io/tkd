import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsArenasController } from './tournaments_arenas.controller';
import { TournamentsArenasService } from './tournaments_arenas.service';

describe('TournamentsArenasController', () => {
  let controller: TournamentsArenasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsArenasController],
      providers: [TournamentsArenasService],
    }).compile();

    controller = module.get<TournamentsArenasController>(
      TournamentsArenasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
