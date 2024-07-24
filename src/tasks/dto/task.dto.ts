import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  listId?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
