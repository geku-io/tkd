import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionCategoriesController } from './competition_categories.controller';
import { CompetitionCategoriesService } from './competition_categories.service';

describe('CompetitionCategoriesController', () => {
  let controller: CompetitionCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionCategoriesController],
      providers: [CompetitionCategoriesService],
    }).compile();

    controller = module.get<CompetitionCategoriesController>(
      CompetitionCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
