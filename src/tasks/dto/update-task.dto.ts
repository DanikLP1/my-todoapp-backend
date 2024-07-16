import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsDateString()
    dueDate?: string;
  
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
  }