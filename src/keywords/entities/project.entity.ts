import { IsString } from 'class-validator';

export class Project {
  @IsString()
  name: string;

  @IsString()
  fullName: string;

  @IsString()
  url: string;
}
