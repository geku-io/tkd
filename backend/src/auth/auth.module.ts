import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(appConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      global: true,
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwtSecret as string,
      }),
      inject: [authConfig.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
