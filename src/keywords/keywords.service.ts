import { HttpException, Injectable, MessageEvent } from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';
import { AddWordDto } from './dto/add-word.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { Keyword } from './entities/keyword.entity';
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

  private readonly subscribedUsers: User[] = [];

  async add(createWordDto: AddWordDto, user: User): Promise<Keyword> {
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
      return keyword;
    } else {
      return await this.keywordsQueries.addKeyword(
        createWordDto.keyword,
        user.id,
      );
    }
  }

  async subscribe(user: User): Promise<Observable<MessageEvent>> {
    const keywords = await this.keywordsQueries.getKeywordsByUser(user.id);
    const eventProcessors: KeywordEventProcessor[] = [];

    for (const keyword of keywords) {
      if (this.keywordEventProcessors.has(keyword.id)) {
        eventProcessors.push(this.keywordEventProcessors.get(keyword.id));
      } else {
        const eventProcessor = new KeywordEventProcessor(keyword.keyword);
        this.keywordEventProcessors.set(keyword.id, eventProcessor);
        eventProcessors.push(eventProcessor);
      }
    }

    this.subscribedUsers.push(user);
    await this.keywordsQueries.insertKeywordToObservedKeywordsByUser(user.id);

    return from(eventProcessors.map((proc) => proc.userDataObservable)).pipe(
      mergeMap((x) => x),
    );
  }

  async unsubscribe(user: User) {
    const index = this.subscribedUsers.findIndex((u) => u.id === user.id);
    this.subscribedUsers.splice(index, 1);
    const userIds = this.subscribedUsers.map((u) => u.id);
    await this.keywordsQueries.removeKeywordFromObservedKeywordsByUser(
      user.id,
      userIds,
    );
  }

  async newProjectsUpdated(newProjectsUpdatedDto: NewProjectsUpdatedDto) {
    const eventProcessor = this.keywordEventProcessors.get(
      newProjectsUpdatedDto.keywordId,
    );
    if (!eventProcessor)
      throw new HttpException('No one is subscribed on this keyword', 400);
    eventProcessor.emitNewProjectsUpdated(newProjectsUpdatedDto.data);
  }

  async topProjectsUpdated(topProjectsUpdatedDto: TopProjectsUpdatedDto) {
    const eventProcessor = this.keywordEventProcessors.get(
      topProjectsUpdatedDto.keywordId,
    );
    if (!eventProcessor)
      throw new HttpException('No one is subscribed on this keyword', 400);
    eventProcessor.emitTopProjectsUpdated(topProjectsUpdatedDto.data);
  }

  async languageFrequenciesUpdated(
    languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    const eventProcessor = this.keywordEventProcessors.get(
      languageFrequenciesUpdatedDto.keywordId,
    );
    if (!eventProcessor)
      throw new HttpException('No one is subscribed on this keyword', 400);
    eventProcessor.emitLanguageFrequenciesUpdated(
      languageFrequenciesUpdatedDto.data,
    );
  }
}
