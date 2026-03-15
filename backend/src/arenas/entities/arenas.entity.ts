import { EntityWithTitle } from 'src/common/entity';
import { Competition } from 'src/competitions/entities/competition.entity';
import { TournamentsArena } from 'src/tournaments_arenas/entities/tournaments_arena.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('arenas')
export class Arena extends EntityWithTitle {
  @OneToMany(() => TournamentsArena, (ta) => ta.arena, { nullable: true })
  tournaments?: TournamentsArena[];

  @OneToMany(() => Competition, (competition) => competition.arena)
  competitions: Competition[];
}
