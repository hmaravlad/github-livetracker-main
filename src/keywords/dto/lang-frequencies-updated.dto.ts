import { IsString, ValidateNested } from 'class-validator';
import { LanguageFrequency } from '../entities/lang-frequency.entity';

export class LanguageFrequenciesUpdatedDto {
  @IsString()
  keyword: string;

  @ValidateNested({ each: true })
  data: LanguageFrequency[];
}
