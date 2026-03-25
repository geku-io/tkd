import { Injectable } from '@nestjs/common';
import {
  ReorderTournamentDto,
  ReorderTournamentItem,
  UpdateTournamentDto,
} from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { ILike, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';
import { EntityWithTitleDto, FindDto } from 'src/common/dto';
import { Gateway } from 'src/gateway/gateway';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,

    private gateway: Gateway,
  ) {}

  create(createTournamentDto: EntityWithTitleDto) {
    this.gateway.server.emit('tournament:edited', createTournamentDto);
    return this.tournamentRepository.insert(createTournamentDto);
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

    const [data, count] = await this.tournamentRepository.findAndCount({
      take: limit,
      skip: skip,
      relations: {
        competitions: {
          arena: true,
          discipline: true,
          categories: true,
        },
      },
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
    return this.tournamentRepository.findOneBy({ id });
  }

  update(id: string, updateTournamentDto: UpdateTournamentDto) {
    this.gateway.server.emit('tournament:edited', id);
    return this.tournamentRepository.update(id, updateTournamentDto);
  }

  async reorder(updateTournamentDto: ReorderTournamentDto) {
    const { items } = updateTournamentDto;
    const entities: UpdateResult[] = [];
    for (const item of items) {
      const mutation = await this.tournamentRepository.update(item.id, {
        order: item.order,
      });
      entities.push(mutation);
    }
    this.gateway.server.emit('tournament:edited', entities);
    return entities;
  }

  async remove(id: string) {
    const tournaments = await this.tournamentRepository.find({
      order: {
        order: 'ASC',
      },
    });
    const removingIndex = tournaments.findIndex((item) => item.id === id);
    if (tournaments && removingIndex !== -1) {
      const updatingComps: ReorderTournamentItem[] = tournaments
        .filter((_, index) => index > removingIndex)
        .map((comp) => ({
          id: comp.id,
          order: comp.order - 1,
        }));
      const deleteResult = await this.tournamentRepository.delete({ id });
      if (deleteResult.affected === 1) {
        await this.reorder({ items: updatingComps });
      }
      this.gateway.server.emit('tournament:edited', deleteResult);
      return deleteResult;
    }
  }
}
