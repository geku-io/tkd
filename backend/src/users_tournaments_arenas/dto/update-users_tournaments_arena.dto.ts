import { IsArray, IsUUID } from 'class-validator';

export class UpdateUsersTournamentsArenaDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  items: string[];
}
