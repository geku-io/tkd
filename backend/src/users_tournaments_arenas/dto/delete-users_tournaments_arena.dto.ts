import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateUsersTournamentsArenaDto } from './create-users_tournaments_arena.dto';

export class RemoveUsersTournamentsArenaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUsersTournamentsArenaDto)
  items: CreateUsersTournamentsArenaDto[];
}
