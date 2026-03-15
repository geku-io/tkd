import { IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  title: string;
}
