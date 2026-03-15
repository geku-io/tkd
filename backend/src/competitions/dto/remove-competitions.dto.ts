import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

export class RemoveCompetitionItemDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  arenaId: string;
}

export class RemoveCompetitionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveCompetitionItemDto)
  items: RemoveCompetitionItemDto[];
}
