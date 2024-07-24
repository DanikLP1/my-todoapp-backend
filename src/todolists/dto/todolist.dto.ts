import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, isString, IsString, ValidateNested } from 'class-validator';
import { CreateTaskDto } from 'src/tasks/dto';

export class CreateTodoListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  id: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  @IsArray()
  tasks?: CreateTaskDto[];

  @IsNotEmpty()
  @IsDateString()
  date: string;
}

