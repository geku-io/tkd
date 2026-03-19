import { IsUUID } from 'class-validator';

export class TournamentsArenaInfoDto {
  @IsUUID()
  tournamentId: string;

  @IsUUID()
  arenaId: string;
}
