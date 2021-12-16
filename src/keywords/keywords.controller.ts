import { Controller, Get, Post, Body } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { AddWordDto } from './dto/add-word.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  add(@Body() createWordDto: AddWordDto) {
    return this.keywordsService.add(createWordDto);
  }

  @Get('subscribe')
  subscribe() {
    return this.keywordsService.subscribe();
  }

  @Post('new-projects')
  newProjectsUpdated(@Body() newProjectsUpdatedDto: NewProjectsUpdatedDto) {
    return this.keywordsService.newProjectsUpdated(newProjectsUpdatedDto);
  }

  @Post('top-projects')
  topProjectsUpdated(@Body() topProjectsUpdatedDto: TopProjectsUpdatedDto) {
    return this.keywordsService.topProjectsUpdated(topProjectsUpdatedDto);
  }

  @Post('language-frequencies')
  languageFrequenciesUpdated(
    @Body() languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    return this.keywordsService.languageFrequenciesUpdated(
      languageFrequenciesUpdatedDto,
    );
  }
}
