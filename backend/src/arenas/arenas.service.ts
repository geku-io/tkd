import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Arena } from './entities/arenas.entity';
import { ILike, Repository } from 'typeorm';
import {
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Injectable()
export class ArenasService {
  constructor(
    @InjectRepository(Arena)
    private arenaRepository: Repository<Arena>,
  ) {}

  create(createArenaDto: EntityWithTitleArrDto) {
    const entities = createArenaDto.titles.map((item) => ({
      title: item,
    }));
    return this.arenaRepository.insert(entities);
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

    const [data, count] = await this.arenaRepository.findAndCount({
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
    return this.arenaRepository.findOneBy({ id });
  }

  update(id: string, updateArenaDto: EntityWithTitleDto) {
    return this.arenaRepository.update(id, updateArenaDto);
  }

  remove(id: string) {
    return this.arenaRepository.delete(id);
  }
}
