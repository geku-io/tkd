import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/types/enums';

export const Roles = Reflector.createDecorator<UserRole[]>();
