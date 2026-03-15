import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT!, 10),
}));
