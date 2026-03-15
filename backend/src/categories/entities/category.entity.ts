import { EntityWithTitle } from 'src/common/entity';
import { CompetitionCategory } from 'src/competition_categories/entities/competition_category.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends EntityWithTitle {
  @OneToMany(() => CompetitionCategory, (cc) => cc.category, { nullable: true })
  competitions?: CompetitionCategory[];
}
