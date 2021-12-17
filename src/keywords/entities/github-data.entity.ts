import { LanguageFrequency } from './lang-frequency.entity';
import { Project } from './project.entity';

export class GithubData {
  keyword: string;
  newProjects: Project[];
  topProjects: Project[];
  langFrequencies: LanguageFrequency[];
}
