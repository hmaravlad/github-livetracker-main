import { HttpException, Injectable } from '@nestjs/common';
import { AddWordDto } from './dto/add-word.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { User } from './entities/user.entity';
import { KeywordsQueries } from './keywords.queries';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsQueries: KeywordsQueries) {}

  async add(createWordDto: AddWordDto, user: User) {
    const keyword = await this.keywordsQueries.getKeyword(
      createWordDto.keyword,
    );
    if (
      keyword &&
      (await this.keywordsQueries.checkUserKeywordConnection(
        keyword.id,
        user.id,
      ))
    ) {
      throw new HttpException('This id keyword already added', 400);
    } else if (keyword) {
      await this.keywordsQueries.connectKeywordToUser(keyword.id, user.id);
    } else {
      await this.keywordsQueries.addKeyword(createWordDto.keyword, user.id);
    }
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
