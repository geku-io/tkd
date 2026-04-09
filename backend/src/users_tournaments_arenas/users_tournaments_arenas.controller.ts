import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersTournamentsArenasService } from './users_tournaments_arenas.service';
import { CreateUsersTournamentsArenaDto } from './dto/create-users_tournaments_arena.dto';
import { RemoveUsersTournamentsArenaDto } from './dto/delete-users_tournaments_arena.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import { UpdateUsersTournamentsArenaDto } from './dto/update-users_tournaments_arena.dto';

@Roles([UserRole.ADMIN])
@Controller('users-tournaments-arenas')
export class UsersTournamentsArenasController {
  constructor(
    private readonly usersTournamentsArenasService: UsersTournamentsArenasService,
  ) {}

  @Post()
  create(
    @Body() createUsersTournamentsArenaDto: CreateUsersTournamentsArenaDto,
  ) {
    return this.usersTournamentsArenasService.create(
      createUsersTournamentsArenaDto,
    );
  }

  @Get()
  findAll() {
    return this.usersTournamentsArenasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersTournamentsArenasService.findByUserId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersTournamentsArenaDto: UpdateUsersTournamentsArenaDto,
  ) {
    return this.usersTournamentsArenasService.update(
      id,
      updateUsersTournamentsArenaDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersTournamentsArenasService.remove(id);
  }

  @Delete()
  removeMany(@Body() body: RemoveUsersTournamentsArenaDto) {
    return this.usersTournamentsArenasService.removeMany(body);
  }
}
