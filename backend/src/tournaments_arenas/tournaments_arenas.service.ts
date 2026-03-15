import { Injectable } from '@nestjs/common';
import { CreateTournamentsArenaDto } from './dto/create-tournaments_arena.dto';
import { UpdateTournamentsArenaDto } from './dto/update-tournaments_arena.dto';
import { RemoveTournamentsArenaDto } from './dto/delete-tournaments_arena.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentsArena } from './entities/tournaments_arena.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CompetitionsService } from 'src/competitions/competitions.service';
import { Arena } from 'src/arenas/entities/arenas.entity';

@Injectable()
export class TournamentsArenasService {
  constructor(
    @InjectRepository(TournamentsArena)
    private taRepository: Repository<TournamentsArena>,

    @InjectRepository(Arena)
    private arenaRepository: Repository<Arena>,

    private readonly competitionsService: CompetitionsService,
  ) {}

  async create(createTournamentsArenaDto: CreateTournamentsArenaDto) {
    const { titles, tournamentId } = createTournamentsArenaDto;
    const createdList: TournamentsArena[] = [];
    for (const title of titles) {
      const existingTournamentsArena = await this.taRepository.findOneBy({
        tournament: {
          id: tournamentId,
        },
        arena: {
          title: title,
        },
      });
      if (!existingTournamentsArena) {
        let arena = await this.arenaRepository.findOneBy({ title });
        if (!arena) {
          arena = await this.arenaRepository.save(
            this.arenaRepository.create({ title }),
          );
        }
        const arenasCount = await this.taRepository.count({
          where: {
            tournament: {
              id: tournamentId,
            },
          },
        });
        const arenaOrder = arenasCount + 1;
        const createdArena = await this.taRepository.save(
          this.taRepository.create({
            arena: {
              id: arena.id,
            },
            tournament: {
              id: tournamentId,
            },
            order: arenaOrder,
          }),
        );
        createdList.push(createdArena);
      }
    }
    return createdList;
  }

  findAll() {
    return `This action returns all tournamentsArenas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tournamentsArena`;
  }

  update(id: number, updateTournamentsArenaDto: UpdateTournamentsArenaDto) {
    return `This action updates a #${id} tournamentsArena`;
  }

  remove(id: number) {
    return `This action removes a #${id} tournamentsArena`;
  }

  async removeMany(body: RemoveTournamentsArenaDto) {
    const { items } = body;
    const deletedArenaArr: DeleteResult[] = [];
    for (const { arenaId, tournamentId } of items) {
      await this.competitionsService.removeAllByArena({
        items: [{ arenaId, tournamentId }],
      });

      const deletedArena = await this.taRepository.delete({
        arena: {
          id: arenaId,
        },
        tournament: {
          id: tournamentId,
        },
      });
      deletedArenaArr.push(deletedArena);
    }
    return deletedArenaArr;
  }
}
