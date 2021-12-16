import { Project } from '../entities/project.entity';

export class NewProjectsUpdatedDto {
  keyword: string;
  data: Project[];
}
