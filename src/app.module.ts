import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [KeywordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
