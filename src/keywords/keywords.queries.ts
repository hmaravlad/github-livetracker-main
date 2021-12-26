import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Keyword } from './entities/keyword.entity';

@Injectable()
export class KeywordsQueries {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getKeyword(word: string): Promise<Keyword> {
    const keyword = await this.knex('keywords')
      .select('id', 'keyword', 'created_at as createdAt')
      .where('keyword', '=', word)
      .first();
    return keyword as Keyword;
  }

  async checkUserKeywordConnection(
    keywordId: number,
    userId: number,
  ): Promise<boolean> {
    const connection = await this.knex('user_keyword')
      .select('*')
      .where('keyword_id', '=', keywordId)
      .andWhere('user_id', '=', userId)
      .first();
    return !!connection;
  }

  async connectKeywordToUser(keywordId: number, userId: number): Promise<void> {
    await this.knex('user_keyword').insert({
      user_id: userId,
      keyword_id: keywordId,
    });
  }

  async addKeyword(word: string, userId: number): Promise<Keyword> {
    const newKeyword = await this.knex.transaction(async (trx) => {
      const keyword = (
        await trx('keywords')
          .insert({
            keyword: word,
            created_at: new Date(),
          })
          .returning('*')
      )[0];
      await trx('user_keyword')
        .insert({
          user_id: userId,
          keyword_id: parseInt(keyword.id),
        })
        .returning('*');
      return keyword;
    });
    return newKeyword as Keyword;
  }

  async getKeywordIdsByUser(userId: number): Promise<number[]> {
    const keywordIds = await this.knex('user_keyword')
      .select('keyword_id as keywordId')
      .where('user_id', '=', userId);
    return keywordIds.map((val) => val.keywordId);
  }

  async getKeywordsByUser(userId: number): Promise<Keyword[]> {
    const keywordIds = await this.getKeywordIdsByUser(userId);
    const keywords = await this.knex('keywords')
      .select('id', 'keyword', 'created_at as createdAt')
      .whereIn('id', keywordIds);
    return keywords;
  }

  async insertKeywordToObservedKeywordsByUser(userId: number): Promise<void> {
    let keywordIds = await this.getKeywordIdsByUser(userId);
    const addedIds = (
      await this.knex('observed_keywords').select('keyword_id')
    ).map((x) => x.keyword_id);
    keywordIds = keywordIds.filter((id) => !addedIds.includes(id));
    for (const id of keywordIds) {
      await this.knex('observed_keywords').insert({
        keyword_id: id,
        added_at: new Date(),
      });
    }
  }

  async removeKeywordFromObservedKeywordsByUser(
    userId: number,
    subscribedUsers: number[],
  ): Promise<void> {
    subscribedUsers = subscribedUsers.filter((id) => id != userId);
    let keywordIds = await this.getKeywordIdsByUser(userId);
    const stillObservedKeywordIds = (
      await this.knex('user_keyword')
        .select('keyword_id as id')
        .distinct()
        .whereIn('user_id', subscribedUsers)
    ).map((x) => x.id);
    keywordIds = keywordIds.filter(
      (id) => !stillObservedKeywordIds.includes(id),
    );
    await this.knex('observed_keywords')
      .delete()
      .whereIn('keyword_id', keywordIds);
  }
}
