import { Injectable } from '@nestjs/common';
import { AddWordDto } from './dto/add-word.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';

@Injectable()
export class KeywordsService {
  add(createWordDto: AddWordDto) {
    console.log('not implemented');
  }

  subscribe() {
    console.log('not implemented');
  }

  newProjectsUpdated(newProjectsUpdatedDto: NewProjectsUpdatedDto) {
    console.log('not implemented');
  }

  topProjectsUpdated(topProjectsUpdatedDto: TopProjectsUpdatedDto) {
    console.log('not implemented');
  }

  languageFrequenciesUpdated(
    languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    console.log('not implemented');
  }
}
