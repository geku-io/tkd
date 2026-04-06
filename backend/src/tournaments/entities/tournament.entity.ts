import { EntityWithTitleAndOrder } from 'src/common/entity';
import { Competition } from 'src/competitions/entities/competition.entity';
import { TournamentsArena } from 'src/tournaments_arenas/entities/tournaments_arena.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('tournaments')
export class Tournament extends EntityWithTitleAndOrder {
  @OneToMany(() => Competition, (competition) => competition.tournament, {
    eager: true,
  })
  competitions: Competition[];

  @OneToMany(() => TournamentsArena, (ta) => ta.tournament, {
    nullable: true,
    eager: true,
  })
  arenas?: TournamentsArena[];

  @Column({ type: 'boolean', default: 'true' })
  isVisible: boolean;
}
