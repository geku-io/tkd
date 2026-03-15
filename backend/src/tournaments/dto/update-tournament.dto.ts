import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentDto } from './create-tournament.dto';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {
  @IsString()
  title: string;
}

export class ReorderTournamentItem {
  @IsUUID()
  id: string;

  @IsNumber()
  order: number;
}

export class ReorderTournamentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTournamentItem)
  items: ReorderTournamentItem[];
}
