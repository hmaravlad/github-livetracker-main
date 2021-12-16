import { Injectable } from '@nestjs/common';
import { AddWordDto } from './dto/add-word.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { KeywordsQueries } from './keywords.queries';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsQueries: KeywordsQueries) {}

  async add(createWordDto: AddWordDto) {
    console.log('not implemented');
  }

  async subscribe() {
    console.log('not implemented');
  }

  async newProjectsUpdated(newProjectsUpdatedDto: NewProjectsUpdatedDto) {
    console.log('not implemented');
  }

  async topProjectsUpdated(topProjectsUpdatedDto: TopProjectsUpdatedDto) {
    console.log('not implemented');
  }

  async languageFrequenciesUpdated(
    languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    console.log('not implemented');
  }
}
