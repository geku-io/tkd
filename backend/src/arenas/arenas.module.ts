import { Module } from '@nestjs/common';
import { ArenasService } from './arenas.service';
import { ArenasController } from './arenas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arena } from './entities/arenas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arena])],
  controllers: [ArenasController],
  providers: [ArenasService],
  exports: [TypeOrmModule],
})
export class ArenasModule {}
