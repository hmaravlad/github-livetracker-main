import { IsNumber, IsString } from 'class-validator';

export class LanguageFrequency {
  @IsString()
  language: string;

  @IsNumber()
  frequency: number;
}
