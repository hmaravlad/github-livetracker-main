import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { User } from './entities/user.entity';

@Injectable()
export class KeywordsQueries {
  constructor(@InjectKnex() private readonly knex: Knex) {}
}
