import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionCategoriesService } from './competition_categories.service';

describe('CompetitionCategoriesService', () => {
  let service: CompetitionCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionCategoriesService],
    }).compile();

    service = module.get<CompetitionCategoriesService>(
      CompetitionCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
