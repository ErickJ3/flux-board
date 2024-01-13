import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @MaxLength(120)
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  user_id?: string;
}
