import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { LanguageFrequency } from '../entities/lang-frequency.entity';

export class LanguageFrequenciesUpdatedDto {
  @IsNumber()
  keywordId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageFrequency)
  data: LanguageFrequency[];
}
