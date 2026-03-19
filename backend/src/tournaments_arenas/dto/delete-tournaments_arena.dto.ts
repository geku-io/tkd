import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { TournamentsArenaInfoDto } from './tournaments_arena.dto';

export class RemoveTournamentsArenaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TournamentsArenaInfoDto)
  items: TournamentsArenaInfoDto[];
}
