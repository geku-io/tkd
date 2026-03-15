import { Arena } from 'src/arenas/entities/arenas.entity';
import { EntityWithOrder } from 'src/common/entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Entity, ManyToOne } from 'typeorm';

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
}
