import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { InfoDto } from './create-competition.dto';

export class UpdateCompetitionDto extends PartialType(InfoDto) {
  @IsOptional()
  @IsBoolean()
  isFinished?: boolean;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;
}

export class ReorderCompetitionItem {
  @IsNumber()
  order: number;

  @IsUUID()
  tournamentId: string;

  @IsUUID()
  arenaId: string;

  @IsUUID()
  id: string;
}

export class ReorderCompetitionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderCompetitionItem)
  items: ReorderCompetitionItem[];
}
