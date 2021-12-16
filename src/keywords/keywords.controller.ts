import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { AddWordDto } from './dto/add-word.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { AuthService } from './auth.service';

@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async add(
    @Headers('authorization') token,
    @Body() createWordDto: AddWordDto,
  ) {
    const user = await this.authService.check(token);
    console.dir({ user });
    return this.keywordsService.add(createWordDto);
  }

  @Get('subscribe')
  async subscribe() {
    return this.keywordsService.subscribe();
  }

  @Post('new-projects')
  async newProjectsUpdated(
    @Body() newProjectsUpdatedDto: NewProjectsUpdatedDto,
  ) {
    return this.keywordsService.newProjectsUpdated(newProjectsUpdatedDto);
  }

  @Post('top-projects')
  async topProjectsUpdated(
    @Body() topProjectsUpdatedDto: TopProjectsUpdatedDto,
  ) {
    return this.keywordsService.topProjectsUpdated(topProjectsUpdatedDto);
  }

  @Post('language-frequencies')
  async languageFrequenciesUpdated(
    @Body() languageFrequenciesUpdatedDto: LanguageFrequenciesUpdatedDto,
  ) {
    return this.keywordsService.languageFrequenciesUpdated(
      languageFrequenciesUpdatedDto,
    );
  }
}
