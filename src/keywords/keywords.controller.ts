import {
  Controller,
  Post,
  Body,
  Headers,
  Sse,
  MessageEvent,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { AddWordDto } from './dto/add-word.dto';
import { NewProjectsUpdatedDto } from './dto/new-projects-updated.dto';
import { TopProjectsUpdatedDto } from './dto/top-projects-updated.dto';
import { LanguageFrequenciesUpdatedDto } from './dto/lang-frequencies-updated.dto';
import { AuthService } from './auth.service';
import { from, interval, map, mergeMap, Observable } from 'rxjs';

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
    return this.keywordsService.add(createWordDto, user);
  }

  @Sse('subscribe/:authorization')
  subscribe(@Param('authorization') token): Observable<MessageEvent> {
    return from(this.subscribeAsync(token)).pipe(mergeMap((x) => x));
  }

  async subscribeAsync(
    @Param('authorization') token,
  ): Promise<Observable<MessageEvent>> {
    try {
      const user = await this.authService.check(token);
      return await this.keywordsService.subscribe(user);
    } catch (error) {
      return from([
        {
          data: 'error',
        },
      ]);
    }
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
