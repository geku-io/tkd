import { Test, TestingModule } from '@nestjs/testing';
import { UsersTournamentsArenasService } from './users_tournaments_arenas.service';

describe('UsersTournamentsArenasService', () => {
  let service: UsersTournamentsArenasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersTournamentsArenasService],
    }).compile();

    service = module.get<UsersTournamentsArenasService>(
      UsersTournamentsArenasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
