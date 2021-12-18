import { Injectable } from '@nestjs/common';
import { Keyword } from '../entities/keyword.entity';

@Injectable()
export class KeywordsQueriesMock {
  private keywords: Keyword[] = [];
  private userKeywordConnections: { userId: number; keywordId: number }[] = [];

  async getKeyword(word: string): Promise<Keyword> {
    return this.keywords.find((keyword) => keyword.keyword === word);
  }

  async checkUserKeywordConnection(
    keywordId: number,
    userId: number,
  ): Promise<boolean> {
    const connection = this.userKeywordConnections.find(
      (c) => c.keywordId === keywordId && c.userId === userId,
    );
    return !!connection;
  }

  async connectKeywordToUser(keywordId: number, userId: number): Promise<void> {
    await this.userKeywordConnections.push({
      keywordId,
      userId,
    });
  }

  async addKeyword(word: string, userId: number): Promise<Keyword> {
    const keywordId = this.keywords.length;
    const keyword = {
      id: keywordId,
      keyword: word,
      createdAt: new Date(),
    };
    this.keywords.push(keyword);
    this.connectKeywordToUser(keywordId, userId);
    return keyword;
  }

  async getKeywordIdsByUser(userId: number): Promise<number[]> {
    const keywordIds = this.userKeywordConnections.filter(
      (c) => c.userId === userId,
    );
    return keywordIds.map((val) => val.keywordId);
  }

  async getKeywordsByUser(userId: number): Promise<Keyword[]> {
    const keywordIds = await this.getKeywordIdsByUser(userId);
    const keywords = this.keywords.filter((k) => keywordIds.includes(k.id));
    return keywords;
  }
}
