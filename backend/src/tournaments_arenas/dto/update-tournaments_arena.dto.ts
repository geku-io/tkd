import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentsArenaDto } from './create-tournaments_arena.dto';

export class UpdateTournamentsArenaDto extends PartialType(
  CreateTournamentsArenaDto,
) {}
