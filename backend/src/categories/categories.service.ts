import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import {
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: EntityWithTitleArrDto) {
    const entities = createCategoryDto.titles.map((item) => ({
      title: item,
    }));
    return this.categoryRepository.save(
      this.categoryRepository.create(entities),
    );
  }

  async findAll(query: FindDto) {
    const { q: querySearch, limit, skip, order } = query;

    const orderPairs = order
      ? Object.fromEntries(
          order.split(',').map((pair) => {
            const [field, direction] = pair.split(':');
            return [field, direction];
          }),
        )
      : undefined;

    const [data, count] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: skip,
      order: orderPairs,
      where: querySearch
        ? {
            title: ILike(`%${querySearch}%`),
          }
        : undefined,
    });
    return {
      data,
      count,
    };
  }

  findOne(id: string) {
    return this.categoryRepository.findOneBy({ id });
  }

  update(id: string, updateCategoryDto: EntityWithTitleDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }

  removeMany(ids: string[]) {
    return this.categoryRepository.delete(ids);
  }
}
