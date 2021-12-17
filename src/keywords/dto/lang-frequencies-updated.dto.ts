import { IsNumber, ValidateNested } from 'class-validator';
import { LanguageFrequency } from '../entities/lang-frequency.entity';

export class LanguageFrequenciesUpdatedDto {
  @IsNumber()
  keywordId: number;

  @ValidateNested({ each: true })
  data: LanguageFrequency[];
}
