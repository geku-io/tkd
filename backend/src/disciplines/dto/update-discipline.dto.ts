import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { EntityWithTitleDto } from 'src/common/dto';

export class UpdateDisciplineDto extends PartialType(EntityWithTitleDto) {
  @IsString()
  title: string;
}
