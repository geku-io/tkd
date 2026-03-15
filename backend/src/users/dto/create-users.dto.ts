import { IsEnum } from 'class-validator';
import { LoginDto } from 'src/common/dto';
import { UserRole } from 'src/types/enums';

export class CreateUserDto extends LoginDto {
  @IsEnum(UserRole)
  role: UserRole;
}
