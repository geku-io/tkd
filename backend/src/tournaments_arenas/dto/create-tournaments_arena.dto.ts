import { ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';

export class CreateTournamentsArenaDto {
  @IsUUID()
  tournamentId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  titles: string[];
}
