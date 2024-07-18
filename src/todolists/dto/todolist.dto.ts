import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}

