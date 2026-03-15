import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

export abstract class EntityWithTitle extends BaseEntity {
  @Column({ type: 'text' })
  title: string;
}

export abstract class EntityWithOrder extends BaseEntity {
  @Column({ type: 'smallint' })
  order: number;
}

export abstract class EntityWithTitleAndOrder extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'smallint' })
  order: number;
}
