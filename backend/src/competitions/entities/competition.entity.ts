import { Discipline } from 'src/disciplines/entities/discipline.entity';
import { Arena } from 'src/arenas/entities/arenas.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CompetitionCategory } from 'src/competition_categories/entities/competition_category.entity';
import { EntityWithOrder } from 'src/common/entity';

@Entity('competitions')
export class Competition extends EntityWithOrder {
  @ManyToOne(() => Tournament, (tournament) => tournament.competitions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ type: 'boolean', default: false })
  isFinished: boolean;

  @Column({ type: 'boolean', default: 'false' })
  isLive: boolean;

  @Column({ type: 'time', nullable: true, default: null })
  startTime?: string;

  @ManyToOne(() => Discipline, (discipline) => discipline.competitions, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'discipline_id' })
  discipline?: Discipline;

  @ManyToOne(() => Arena, (arena) => arena.competitions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'arena_id' })
  arena?: Arena;

  @OneToMany(() => CompetitionCategory, (cc) => cc.competition, {
    nullable: true,
    eager: true,
  })
  categories?: CompetitionCategory[];
}
