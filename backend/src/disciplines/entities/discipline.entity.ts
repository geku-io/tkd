import { EntityWithTitle } from 'src/common/entity';
import { Competition } from 'src/competitions/entities/competition.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('disciplines')
export class Discipline extends EntityWithTitle {
  @OneToMany(() => Competition, (competition) => competition.discipline)
  competitions: Competition[];
}
