import { Injectable } from '@nestjs/common';
import { CreateUsersTournamentsArenaDto } from './dto/create-users_tournaments_arena.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersTournamentsArena } from './entities/users_tournaments_arena.entity';
import { Repository } from 'typeorm';
import { Gateway } from 'src/gateway/gateway';
import { RemoveUsersTournamentsArenaDto } from './dto/delete-users_tournaments_arena.dto';
import { DeleteResult } from 'typeorm/browser';
import { UpdateUsersTournamentsArenaDto } from './dto/update-users_tournaments_arena.dto';

@Injectable()
export class UsersTournamentsArenasService {
  constructor(
    @InjectRepository(UsersTournamentsArena)
    private utaRepository: Repository<UsersTournamentsArena>,

    private gateway: Gateway,
  ) {}

  async create(createUsersTournamentsArenaDto: CreateUsersTournamentsArenaDto) {
    const { userId, tournamentsArenaId } = createUsersTournamentsArenaDto;

    const existingRelation = await this.utaRepository.findOneBy({
      user: {
        id: userId,
      },
      tournamentsArena: {
        id: tournamentsArenaId,
      },
    });

    if (existingRelation) {
      return existingRelation;
    }

    const createdRelation = await this.utaRepository.save(
      this.utaRepository.create({
        user: {
          id: userId,
        },
        tournamentsArena: {
          id: tournamentsArenaId,
        },
      }),
    );

    this.gateway.server.emit('user:tournamentsArena:created', createdRelation);
    return createdRelation;
  }

  findAll() {
    return this.utaRepository.find();
  }

  async findByUserId(userId: string) {
    return this.utaRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        tournamentsArena: {
          arena: true,
          tournament: true,
          users: true,
        },
        user: true,
      },
    });
  }

  async update(
    userId: string,
    updateUsersTournamentsArenaDto: UpdateUsersTournamentsArenaDto,
  ) {
    const { items } = updateUsersTournamentsArenaDto;
    const updatedUsersArenasArr: UsersTournamentsArena[] = [];

    for (const id of items) {
      const createdUsersArenas = await this.create({
        userId,
        tournamentsArenaId: id,
      });
      updatedUsersArenasArr.push(createdUsersArenas);
    }

    const prevState = await this.findByUserId(userId);

    if (prevState) {
      const removedItems: CreateUsersTournamentsArenaDto[] = prevState
        .filter((prevItem) =>
          items.every((i) => i !== prevItem.tournamentsArena.id),
        )
        .map((item) => ({
          userId,
          tournamentsArenaId: item.tournamentsArena.id,
        }));

      await this.removeMany({ items: removedItems });
    }

    this.gateway.server.emit(
      'user:tournamentsArena:updated',
      updatedUsersArenasArr,
    );
    return updatedUsersArenasArr;
  }

  async remove(id: string) {
    const existing = await this.utaRepository.findOneBy({ id });
    if (!existing) {
      return null;
    }

    const result = await this.utaRepository.remove(existing);
    this.gateway.server.emit('user:tournamentsArena:removed', id);
    return result;
  }

  async removeMany(body: RemoveUsersTournamentsArenaDto) {
    const { items } = body;
    const deletedUsersArenasArr: DeleteResult[] = [];
    for (const { tournamentsArenaId, userId } of items) {
      const deletedArena = await this.utaRepository.delete({
        user: {
          id: userId,
        },
        tournamentsArena: {
          id: tournamentsArenaId,
        },
      });
      deletedUsersArenasArr.push(deletedArena);
    }

    this.gateway.server.emit('tournament:edited', deletedUsersArenasArr);

    return deletedUsersArenasArr;
  }
}
