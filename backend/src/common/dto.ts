import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class EntityWithTitleDto {
  @IsString()
  title: string;
}

export class EntityWithTitleArrDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  titles: string[];
}

export class EntityWithIdArrDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  items: string[];
}

export class FindDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsString()
  order?: string;
}

export class LoginDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
