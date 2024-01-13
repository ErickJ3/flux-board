import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(120)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  username?: string;
}
