import { Injectable } from '@nestjs/common';

@Injectable()
export class CompetitionCategoriesService {
  create(createCompetitionCategoryDto: unknown) {
    return 'This action adds a new competitionCategory';
  }

  findAll() {
    return `This action returns all competitionCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competitionCategory`;
  }

  update(id: number, updateCompetitionCategoryDto: unknown) {
    return `This action updates a #${id} competitionCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} competitionCategory`;
  }
}
