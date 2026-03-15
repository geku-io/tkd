import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_ACCESS_TOKEN,
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME,
  defaultAdminPass: process.env.DEFAULT_ADMIN_PASS,
  accessExpires: process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
  refreshExpires: process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS,
}));
