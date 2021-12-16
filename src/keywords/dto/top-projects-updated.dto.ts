import { IsString, ValidateNested } from 'class-validator';
import { Project } from '../entities/project.entity';

export class TopProjectsUpdatedDto {
  @IsString()
  keyword: string;

  @ValidateNested({ each: true })
  data: Project[];
}
