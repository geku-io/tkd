import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity';
import { Discipline } from 'src/disciplines/entities/discipline.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Arena } from 'src/arenas/entities/arenas.entity';
import { CompetitionCategory } from 'src/competition_categories/entities/competition_category.entity';
import { TournamentsArena } from 'src/tournaments_arenas/entities/tournaments_arena.entity';
import { DisciplinesModule } from 'src/disciplines/disciplines.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Competition,
      Discipline,
      Tournament,
      Category,
      Arena,
      CompetitionCategory,
      TournamentsArena,
    ]),
    DisciplinesModule,
    CategoriesModule,
    GatewayModule,
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [TypeOrmModule, CompetitionsService],
})
export class CompetitionsModule {}
