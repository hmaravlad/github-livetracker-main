import { Project } from '../entities/project.entity';

export class TopProjectsUpdatedDto {
  keyword: string;
  data: Project[];
}
