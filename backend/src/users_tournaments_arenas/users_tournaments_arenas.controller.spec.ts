import { Test, TestingModule } from '@nestjs/testing';
import { UsersTournamentsArenasController } from './users_tournaments_arenas.controller';
import { UsersTournamentsArenasService } from './users_tournaments_arenas.service';

describe('UsersTournamentsArenasController', () => {
  let controller: UsersTournamentsArenasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersTournamentsArenasController],
      providers: [UsersTournamentsArenasService],
    }).compile();

    controller = module.get<UsersTournamentsArenasController>(
      UsersTournamentsArenasController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
