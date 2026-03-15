import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TournamentsArenasService } from './tournaments_arenas.service';
import { CreateTournamentsArenaDto } from './dto/create-tournaments_arena.dto';
import { UpdateTournamentsArenaDto } from './dto/update-tournaments_arena.dto';
import { RemoveTournamentsArenaDto } from './dto/delete-tournaments_arena.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';

@Roles([UserRole.ADMIN])
@Controller('tournaments-arenas')
export class TournamentsArenasController {
  constructor(
    private readonly tournamentsArenasService: TournamentsArenasService,
  ) {}

  @Post()
  create(@Body() createTournamentsArenaDto: CreateTournamentsArenaDto) {
    return this.tournamentsArenasService.create(createTournamentsArenaDto);
  }

  @Get()
  findAll() {
    return this.tournamentsArenasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsArenasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTournamentsArenaDto: UpdateTournamentsArenaDto,
  ) {
    return this.tournamentsArenasService.update(+id, updateTournamentsArenaDto);
  }

  @Delete()
  removeMany(@Body() body: RemoveTournamentsArenaDto) {
    return this.tournamentsArenasService.removeMany(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsArenasService.remove(+id);
  }
}
