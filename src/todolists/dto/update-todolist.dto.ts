import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodoListDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;
  }