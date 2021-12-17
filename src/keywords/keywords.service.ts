import { HttpException, Injectable, MessageEvent } from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';
import { AddWordDto } from './dto/add-word.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { User } from './entities/user.entity';
import { KeywordEventProcessor } from './keyword.event-processor';
import { KeywordsQueries } from './keywords.queries';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsQueries: KeywordsQueries) {}

  private readonly keywordEventProcessors = new Map<
    number,
    KeywordEventProcessor
  >();

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

  async subscribe(user: User): Promise<Observable<MessageEvent>> {
    const keywords = await this.keywordsQueries.getKeywordsByUser(user.id);
    const eventProcessors: KeywordEventProcessor[] = [];

    for (const keyword of keywords) {
      if (this.keywordEventProcessors.has(keyword.id)) {
        eventProcessors.push(this.keywordEventProcessors.get(keyword.id));
      } else {
        //should notify worker supervisor here
        const eventProcessor = new KeywordEventProcessor(keyword.keyword);
        this.keywordEventProcessors.set(keyword.id, eventProcessor);
        eventProcessors.push(eventProcessor);
      }
    }
    return from(eventProcessors.map((proc) => proc.userDataObservable)).pipe(
      mergeMap((x) => x),
    );
  }

  async newProjectsUpdated(newProjectsUpdatedDto: NewProjectsUpdatedDto) {
    const eventProcessor = this.keywordEventProcessors.get(
      newProjectsUpdatedDto.keywordId,
    );
    if (!eventProcessor) return;
    eventProcessor.emitNewProjectsUpdated(newProjectsUpdatedDto.data);
  }

  async topProjectsUpdated(topProjectsUpdatedDto: TopProjectsUpdatedDto) {
    const eventProcessor = this.keywordEventProcessors.get(
      topProjectsUpdatedDto.keywordId,
    );
    if (!eventProcessor) return;
    eventProcessor.emitTopProjectsUpdated(topProjectsUpdatedDto.data);
  }

  async languageFrequenciesUpdated(
    languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    const eventProcessor = this.keywordEventProcessors.get(
      languageFrequenciesUpdatedDto.keywordId,
    );
    if (!eventProcessor) return;
    eventProcessor.emitLanguageFrequenciesUpdated(
      languageFrequenciesUpdatedDto.data,
    );
  }
}
