import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import {
  ReorderCompetitionDto,
  UpdateCompetitionDto,
} from './dto/update-competition.dto';
import {
  RemoveCompetitionItemDto,
  RemoveCompetitionsDto,
} from './dto/remove-competitions.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';

@Roles([UserRole.ADMIN])
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  create(@Body(ValidationPipe) createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.create(createCompetitionDto);
  }

  /* @Get()
  findAll(@Query() query: FindCompetitionsDto) {
    return this.competitionsService.findAll(query);
  } */

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.competitionsService.findOne(id);
  }

  @Patch('/reorder')
  reorder(@Body(ValidationPipe) reorderCompetitionDto: ReorderCompetitionDto) {
    return this.competitionsService.reorder(reorderCompetitionDto);
  }

  /* @Patch('/move')
  move(@Body(ValidationPipe) moveCompetitionDto: UpdateCompetitionDto) {
    return this.competitionsService.move(moveCompetitionDto);
  } */

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete()
  removeMany(@Body() body: RemoveCompetitionsDto) {
    return this.competitionsService.removeAllByArena(body);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: RemoveCompetitionItemDto,
  ) {
    return this.competitionsService.remove(id, body);
  }
}
