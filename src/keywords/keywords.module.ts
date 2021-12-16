import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsQueries } from './keywords.queries';

@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsQueries],
})
export class KeywordsModule {}
