import { Category } from 'src/categories/entities/category.entity';
import { BaseEntity } from 'src/common/entity';
import { Competition } from 'src/competitions/entities/competition.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity('competition_category')
export class CompetitionCategory extends BaseEntity {
  @ManyToOne(() => Competition, (competition) => competition.categories, {
    onDelete: 'CASCADE',
  })
  competition: Competition;

  @ManyToOne(() => Category, (category) => category.competitions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  category: Category;
}
