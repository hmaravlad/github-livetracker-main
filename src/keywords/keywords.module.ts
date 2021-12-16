import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsQueries } from './keywords.queries';
import { AuthService } from './auth.service';

@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsQueries, AuthService],
})
export class KeywordsModule {}
