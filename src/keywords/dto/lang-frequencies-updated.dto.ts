import { LanguageFrequency } from '../entities/lang-frequency.entity';

export class LanguageFrequenciesUpdatedDto {
  keyword: string;
  data: LanguageFrequency[];
}
