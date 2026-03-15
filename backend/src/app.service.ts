import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { UserRole } from './types/enums';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}
  async onApplicationBootstrap() {
    const authVariables =
      this.configService.get<ConfigType<typeof authConfig>>('auth');
    if (authVariables?.defaultAdminName && authVariables.defaultAdminPass) {
      const existUser = await this.usersService.findOne(
        authVariables.defaultAdminName,
      );
      if (!existUser) {
        await this.usersService.create({
          name: authVariables.defaultAdminName,
          password: authVariables.defaultAdminPass,
          role: UserRole.ADMIN,
        });
      }
    }
  }
}
