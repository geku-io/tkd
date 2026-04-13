import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import bcrypt from 'bcrypt';
import { FindDto } from 'src/common/dto';
import { JwtPayload } from 'src/auth/guards/auth/auth.guard';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createuserDto: CreateUserDto) {
    const { password, ...credentials } = createuserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.insert({
      password: hashedPassword,
      ...credentials,
    });
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

    const [data, count] = await this.userRepository.findAndCount({
      take: limit,
      skip: skip,
      order: orderPairs,
      where: querySearch
        ? {
            name: ILike(`%${querySearch}%`),
          }
        : undefined,
    });
    const users = data.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = item;
      return user;
    });
    return {
      data: users,
      count,
    };
  }

  findOne(name: string) {
    return this.userRepository.findOneBy({ name });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  async update(id: string, updateDisciplineDto: UpdateUserDto) {
    const { password, ...credentials } = updateDisciplineDto;
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    return this.userRepository.update(id, {
      password: hashedPassword,
      ...credentials,
    });
  }

  remove(id: string, user: JwtPayload) {
    if (user.id === id) {
      throw new Error('Вы не можете удалить свой аккаунт');
    }
    return this.userRepository.delete(id);
  }

  async removeMany(ids: string[], user: JwtPayload) {
    const deleteResult: DeleteResult[] = [];
    for (const id of ids) {
      if (user.id !== id) {
        const deletedItem = await this.userRepository.delete(id);
        deleteResult.push(deletedItem);
      }
    }
    return deleteResult;
  }
}
