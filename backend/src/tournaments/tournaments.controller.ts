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
  Query,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import {
  ReorderTournamentDto,
  UpdateTournamentDto,
} from './dto/update-tournament.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import { EntityWithTitleDto, FindDto } from 'src/common/dto';
import { type JwtPayload } from 'src/auth/guards/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';

@Roles([UserRole.ADMIN, UserRole.EDITOR])
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  create(@Body(ValidationPipe) createTournamentDto: EntityWithTitleDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  find(@Query() query: FindDto, @CurrentUser() user: JwtPayload) {
    return this.tournamentsService.find(query, user);
  }

  @Public()
  @Get('/schedule')
  findAll(@Query() query: FindDto) {
    return this.tournamentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Patch('/reorder')
  reorder(@Body(ValidationPipe) reorderCompetitionDto: ReorderTournamentDto) {
    return this.tournamentsService.reorder(reorderCompetitionDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.remove(id);
  }
}
