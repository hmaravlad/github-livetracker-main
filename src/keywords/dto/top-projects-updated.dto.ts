import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Project } from '../entities/project.entity';

export class TopProjectsUpdatedDto {
  @IsNumber()
  keywordId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Project)
  data: Project[];
}
