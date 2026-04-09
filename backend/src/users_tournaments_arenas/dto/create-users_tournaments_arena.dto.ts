import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUsersTournamentsArenaDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  tournamentsArenaId: string;
}
