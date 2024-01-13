import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBoardDto {
  @MaxLength(120)
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
