import { Injectable } from '@nestjs/common';
import { combineLatest, map, Observable, ReplaySubject } from 'rxjs';
import { GithubData } from './entities/github-data.entity';
import { LanguageFrequency } from './entities/lang-frequency.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class KeywordEventProcessor {
  private newProjectsSubject = new ReplaySubject<Project[]>();
  private topProjectsSubject = new ReplaySubject<Project[]>();
  private langFrequenciesSubject = new ReplaySubject<LanguageFrequency[]>();
  readonly userDataObservable: Observable<{ data: GithubData }>;

  constructor(readonly keyword) {
    this.newProjectsSubject.next([]);
    this.topProjectsSubject.next([]);
    this.langFrequenciesSubject.next([]);
    this.topProjectsSubject.next([]);

    this.userDataObservable = combineLatest({
      newProjects: this.newProjectsSubject,
      topProjects: this.topProjectsSubject,
      langFrequencies: this.langFrequenciesSubject,
    }).pipe(
      map((data) => {
        return {
          data: {
            ...data,
            keyword: this.keyword,
          },
        };
      }),
    );
  }

  emitNewProjectsUpdated(projects: Project[]) {
    this.newProjectsSubject.next(projects);
  }

  emitTopProjectsUpdated(projects: Project[]) {
    this.topProjectsSubject.next(projects);
  }

  emitLanguageFrequenciesUpdated(languageFrequencies: LanguageFrequency[]) {
    this.langFrequenciesSubject.next(languageFrequencies);
  }
}
