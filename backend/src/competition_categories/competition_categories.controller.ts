import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompetitionCategoriesService } from './competition_categories.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';

@Roles([UserRole.ADMIN])
@Controller('competition-categories')
export class CompetitionCategoriesController {
  constructor(
    private readonly competitionCategoriesService: CompetitionCategoriesService,
  ) {}

  @Post()
  create(@Body() createCompetitionCategoryDto: unknown) {
    return this.competitionCategoriesService.create(
      createCompetitionCategoryDto,
    );
  }

  @Get()
  findAll() {
    return this.competitionCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompetitionCategoryDto: unknown,
  ) {
    return this.competitionCategoriesService.update(
      +id,
      updateCompetitionCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionCategoriesService.remove(+id);
  }
}
