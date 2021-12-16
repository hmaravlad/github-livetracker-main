import { IsString, ValidateNested } from 'class-validator';
import { Project } from '../entities/project.entity';

export class NewProjectsUpdatedDto {
  @IsString()
  keyword: string;

  @ValidateNested({ each: true })
  data: Project[];
}
