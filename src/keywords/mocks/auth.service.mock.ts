import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthServiceMock {
  private users: (User & { token: string })[] = [];

  async check(token: string | undefined): Promise<User> {
    if (token === undefined) {
      throw new UnauthorizedException();
    }

    const user = this.users.find((user) => user.token === token);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  register(email: string): void {
    this.users.push({
      id: this.users.length,
      email,
      createdAt: new Date(),
      token: randomBytes(16).toString('hex'),
    });
  }

  getToken(email: string): string | undefined {
    return this.users.find((user) => user.email === email).token;
  }
}
