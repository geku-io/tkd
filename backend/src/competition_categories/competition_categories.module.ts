import { Module } from '@nestjs/common';
import { CompetitionCategoriesService } from './competition_categories.service';
import { CompetitionCategoriesController } from './competition_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionCategory } from './entities/competition_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionCategory])],
  controllers: [CompetitionCategoriesController],
  providers: [CompetitionCategoriesService],
  exports: [TypeOrmModule, CompetitionCategoriesService],
})
export class CompetitionCategoriesModule {}
