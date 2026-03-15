import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import {
  EntityWithIdArrDto,
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Roles([UserRole.ADMIN])
@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Post()
  create(@Body(ValidationPipe) createDisciplineDto: EntityWithTitleArrDto) {
    return this.disciplinesService.create(createDisciplineDto);
  }

  @Roles([UserRole.EDITOR])
  @Get()
  findAll(@Query() query: FindDto) {
    return this.disciplinesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.disciplinesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDisciplineDto: EntityWithTitleDto,
  ) {
    return this.disciplinesService.update(id, updateDisciplineDto);
  }

  @Delete()
  removeMany(@Body() dto: EntityWithIdArrDto) {
    return this.disciplinesService.removeMany(dto.items);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.disciplinesService.remove(id);
  }
}
