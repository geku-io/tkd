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
import { ArenasService } from './arenas.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import {
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Roles([UserRole.ADMIN])
@Controller('arenas')
export class ArenasController {
  constructor(private readonly arenasService: ArenasService) {}

  @Post()
  create(@Body(ValidationPipe) createArenaDto: EntityWithTitleArrDto) {
    return this.arenasService.create(createArenaDto);
  }

  @Get()
  findAll(@Query() query: FindDto) {
    return this.arenasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.arenasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateArenaDto: EntityWithTitleDto,
  ) {
    return this.arenasService.update(id, updateArenaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.arenasService.remove(id);
  }
}
