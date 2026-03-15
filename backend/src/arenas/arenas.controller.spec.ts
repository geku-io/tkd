import { Test, TestingModule } from '@nestjs/testing';
import { ArenasController } from './arenas.controller';
import { PlacesService } from './arenas.service';

describe('ArenasController', () => {
  let controller: ArenasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArenasController],
      providers: [PlacesService],
    }).compile();

    controller = module.get<ArenasController>(ArenasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
