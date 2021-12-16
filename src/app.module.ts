import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfig, parseConfig } from './config';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [
    KeywordsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [parseConfig],
    }),
    KnexModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: getConfig(configService).db,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
