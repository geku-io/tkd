import { Arena } from 'src/arenas/entities/arenas.entity';
import { EntityWithOrder } from 'src/common/entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { UsersTournamentsArena } from 'src/users_tournaments_arenas/entities/users_tournaments_arena.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('tournaments_arena')
export class TournamentsArena extends EntityWithOrder {
  @ManyToOne(() => Tournament, (tournament) => tournament.arenas, {
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @ManyToOne(() => Arena, (arena) => arena.tournaments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  arena: Arena;

  @OneToMany(() => UsersTournamentsArena, (uta) => uta.tournamentsArena, {
    nullable: true,
  })
  users?: UsersTournamentsArena[];
}
