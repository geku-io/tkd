import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

export class RemoveTournamentsArenaItemDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  arenaId: string;
}

export class RemoveTournamentsArenaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveTournamentsArenaItemDto)
  items: RemoveTournamentsArenaItemDto[];
}
