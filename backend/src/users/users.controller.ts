import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import { EntityWithIdArrDto, FindDto } from 'src/common/dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { type JwtPayload } from 'src/auth/guards/auth/auth.guard';

@Roles([UserRole.ADMIN])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(ValidationPipe) createuserDto: CreateUserDto) {
    return this.usersService.create(createuserDto);
  }

  @Get()
  findAll(@Query() query: FindDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  login(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  removeMany(@Body() dto: EntityWithIdArrDto, @CurrentUser() user: JwtPayload) {
    return this.usersService.removeMany(dto.items, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.remove(id, user);
  }
}
