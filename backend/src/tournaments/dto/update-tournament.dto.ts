import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTournamentDto {
  @IsString()
  title: string;

  @IsBoolean()
  isVisible: boolean;
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
