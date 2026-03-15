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
import { CategoriesService } from './categories.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/types/enums';
import {
  EntityWithIdArrDto,
  EntityWithTitleArrDto,
  EntityWithTitleDto,
  FindDto,
} from 'src/common/dto';

@Roles([UserRole.ADMIN])
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body(ValidationPipe) createCategoryDto: EntityWithTitleArrDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Roles([UserRole.EDITOR])
  @Get()
  findAll(@Query() query: FindDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: EntityWithTitleDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete()
  removeMany(@Body() dto: EntityWithIdArrDto) {
    return this.categoriesService.removeMany(dto.items);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
