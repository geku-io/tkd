import { BaseEntity } from 'src/common/entity';
import { UserRole } from 'src/types/enums';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true, default: null })
  refresh_token: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role: UserRole;
}
