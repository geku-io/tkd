import { IsString } from 'class-validator';
import { TournamentsArenaInfoDto } from './tournaments_arena.dto';

export class UpdateTournamentsArenaDto extends TournamentsArenaInfoDto {
  @IsString()
  title: string;
}
