import { Module } from '@nestjs/common';
import { TournamentsArenasService } from './tournaments_arenas.service';
import { TournamentsArenasController } from './tournaments_arenas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsArena } from './entities/tournaments_arena.entity';
import { CompetitionsModule } from 'src/competitions/competitions.module';
import { Arena } from 'src/arenas/entities/arenas.entity';
import { ArenasModule } from 'src/arenas/arenas.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentsArena, Arena]),
    CompetitionsModule,
    ArenasModule,
    GatewayModule,
  ],
  controllers: [TournamentsArenasController],
  providers: [TournamentsArenasService],
  exports: [TypeOrmModule],
})
export class TournamentsArenasModule {}
