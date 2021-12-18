import { Test, TestingModule } from '@nestjs/testing';
import { takeUntil, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { GithubData } from './entities/github-data.entity';
import { LanguageFrequency } from './entities/lang-frequency.entity';
import { Project } from './entities/project.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsQueries } from './keywords.queries';
import { KeywordsService } from './keywords.service';
import { AuthServiceMock } from './mocks/auth.service.mock';
import { KeywordsQueriesMock } from './mocks/keywords.queries.mock';

function getProject(id) {
  return {
    name: 'name' + id,
    fullName: 'full' + id,
    url: 'url' + id,
  };
}

function getFrequencies(id): LanguageFrequency[] {
  return [
    {
      frequency: id,
      language: 'js',
    },
  ];
}

describe('KeywordsController', () => {
  let controller: KeywordsController;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeywordsController],
      providers: [
        KeywordsService,
        {
          provide: KeywordsQueries,
          useClass: KeywordsQueriesMock,
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
      ],
    }).compile();

    controller = module.get<KeywordsController>(KeywordsController);
    authService = module.get<AuthService>(
      AuthService,
    ) as unknown as AuthServiceMock;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should give data about new projects to user who subscribed', (done) => {
    const email = 'test@gmail.com';
    const newProject: Project = getProject(1);
    const word = 'word';
    authService.register(email);
    const token = authService.getToken(email);

    const timer$ = timer(3000);
    controller.add(token, { keyword: word }).then((keyword) => {
      let newProjectsUpdated = false;
      controller
        .subscribe(token)
        .pipe(takeUntil(timer$))
        .subscribe({
          next: (messageEvent) => {
            const data = messageEvent.data as GithubData;
            expect(data.keyword).toBe(word);
            if (
              data.newProjects[0] &&
              data.newProjects[0].name === newProject.name &&
              data.newProjects[0].fullName === newProject.fullName &&
              data.newProjects[0].url === newProject.url
            ) {
              newProjectsUpdated = true;
            }
          },
          complete: () => {
            expect(newProjectsUpdated).toBe(true);
            done();
          },
        });
      setTimeout(() => {
        controller.newProjectsUpdated({
          keywordId: keyword.id,
          data: [newProject],
        });
      }, 2000);
    });
  });

  it('should give data about top projects to user who subscribed', (done) => {
    const email = 'test@gmail.com';
    const topProject: Project = getProject(1);
    const word = 'word';
    authService.register(email);
    const token = authService.getToken(email);

    const timer$ = timer(3000);
    controller.add(token, { keyword: word }).then((keyword) => {
      let topProjectsUpdated = false;
      controller
        .subscribe(token)
        .pipe(takeUntil(timer$))
        .subscribe({
          next: (messageEvent) => {
            const data = messageEvent.data as GithubData;
            expect(data.keyword).toBe(word);
            if (
              data.topProjects[0] &&
              data.topProjects[0].name === topProject.name &&
              data.topProjects[0].fullName === topProject.fullName &&
              data.topProjects[0].url === topProject.url
            ) {
              topProjectsUpdated = true;
            }
          },
          complete: () => {
            expect(topProjectsUpdated).toBe(true);
            done();
          },
        });
      setTimeout(() => {
        controller.topProjectsUpdated({
          keywordId: keyword.id,
          data: [topProject],
        });
      }, 2000);
    });
  });

  it('should give data about language frequencies to user who subscribed', (done) => {
    const email = 'test@gmail.com';
    const langFrequencies: LanguageFrequency[] = getFrequencies(1);
    const word = 'word';
    authService.register(email);
    const token = authService.getToken(email);

    const timer$ = timer(3000);
    controller.add(token, { keyword: word }).then((keyword) => {
      let languageFrequenciesUpdated = false;
      controller
        .subscribe(token)
        .pipe(takeUntil(timer$))
        .subscribe({
          next: (messageEvent) => {
            const data = messageEvent.data as GithubData;
            expect(data.keyword).toBe(word);
            if (
              data.langFrequencies[0] &&
              data.langFrequencies[0].frequency ===
                langFrequencies[0].frequency &&
              data.langFrequencies[0].language === langFrequencies[0].language
            ) {
              languageFrequenciesUpdated = true;
            }
          },
          complete: () => {
            expect(languageFrequenciesUpdated).toBe(true);
            done();
          },
        });
      setTimeout(() => {
        controller.languageFrequenciesUpdated({
          keywordId: keyword.id,
          data: langFrequencies,
        });
      }, 2000);
    });
  });
});
