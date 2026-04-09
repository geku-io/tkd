import { Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TournamentsArena } from 'src/tournaments_arenas/entities/tournaments_arena.entity';
import { BaseEntity } from 'src/common/entity';

@Entity('users_tournaments_arena')
export class UsersTournamentsArena extends BaseEntity {
  @ManyToOne(() => User, (user) => user.tournamentsArenas, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => TournamentsArena, (ta) => ta.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  tournamentsArena: TournamentsArena;
}
