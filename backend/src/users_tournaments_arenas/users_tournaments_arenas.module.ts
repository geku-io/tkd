import { Module } from '@nestjs/common';
import { UsersTournamentsArenasService } from './users_tournaments_arenas.service';
import { UsersTournamentsArenasController } from './users_tournaments_arenas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTournamentsArena } from './entities/users_tournaments_arena.entity';
import { UsersModule } from 'src/users/users.module';
import { TournamentsArenasModule } from 'src/tournaments_arenas/tournaments_arenas.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersTournamentsArena]),
    UsersModule,
    TournamentsArenasModule,
    GatewayModule,
  ],
  controllers: [UsersTournamentsArenasController],
  providers: [UsersTournamentsArenasService],
  exports: [TypeOrmModule, UsersTournamentsArenasService],
})
export class UsersTournamentsArenasModule {}
