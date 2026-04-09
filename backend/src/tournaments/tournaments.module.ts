import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UsersTournamentsArenasModule } from 'src/users_tournaments_arenas/users_tournaments_arenas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    GatewayModule,
    UsersTournamentsArenasModule,
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TypeOrmModule],
})
export class TournamentsModule {}
