import { IsString } from 'class-validator';

export class AddWordDto {
  @IsString()
  word: string;
}
