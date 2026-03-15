import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(databaseConfig),
        ConfigModule.forFeature(appConfig),
      ],
      useFactory: (
        db: ConfigType<typeof databaseConfig>,
        app: ConfigType<typeof appConfig>,
      ) => ({
        type: 'postgres',
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.db_name,
        synchronize: app.NODE_ENV === 'development',
        autoLoadEntities: true,
      }),
      inject: [databaseConfig.KEY, appConfig.KEY],
    }),
  ],
})
export class DbModule {}
