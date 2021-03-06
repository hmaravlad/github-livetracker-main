import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { request } from 'undici';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../config';

@Injectable()
export class AuthService {
  private authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authServiceUrl = getConfig(this.configService).authServiceUrl;
  }

  async check(token: string | undefined): Promise<User> {
    if (token === undefined) {
      throw new UnauthorizedException();
    }

    const { statusCode, body } = await request(
      `${this.authServiceUrl}/is-auth`,
      {
        method: 'GET',
        headers: {
          authorization: token,
        },
      },
    );

    if (statusCode === 401) {
      throw new UnauthorizedException();
    }

    const user = await body.json();

    return user;
  }
}
