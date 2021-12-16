import { IsString } from 'class-validator';

export class AddWordDto {
  @IsString()
  keyword: string;
}
