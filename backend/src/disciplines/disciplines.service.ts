import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discipline } from './entities/discipline.entity';
import { ILike, Repository } from 'typeorm';
import {
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Injectable()
export class DisciplinesService {
  constructor(
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  async create(createDisciplineDto: EntityWithTitleArrDto) {
    const entities = createDisciplineDto.titles.map((item) => ({
      title: item,
    }));
    return this.disciplineRepository.save(
      this.disciplineRepository.create(entities),
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

    const [data, count] = await this.disciplineRepository.findAndCount({
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
    return this.disciplineRepository.findOneBy({ id });
  }

  update(id: string, updateDisciplineDto: EntityWithTitleDto) {
    return this.disciplineRepository.update(id, updateDisciplineDto);
  }

  remove(id: string) {
    return this.disciplineRepository.delete(id);
  }

  removeMany(ids: string[]) {
    return this.disciplineRepository.delete(ids);
  }
}
