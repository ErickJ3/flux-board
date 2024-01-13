import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenBodyDto {
  @IsString()
  @IsUUID()
  refresh_token: string;
}

export class UserIdParamDto {
  @IsString()
  @IsUUID()
  user_id: string;
}
