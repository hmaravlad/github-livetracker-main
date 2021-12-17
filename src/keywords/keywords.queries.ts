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

  async addKeyword(keyword: string, userId: number): Promise<void> {
    await this.knex.transaction(async (trx) => {
      const keywordId = parseInt(
        (
          await trx('keywords')
            .insert({
              keyword,
              created_at: new Date(),
            })
            .returning('id')
        )[0],
      );
      await trx('user_keyword').insert({
        user_id: userId,
        keyword_id: keywordId,
      });
    });
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
}
