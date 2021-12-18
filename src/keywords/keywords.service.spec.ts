import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { takeUntil, timer } from 'rxjs';
import { GithubData } from './entities/github-data.entity';
import { LanguageFrequency } from './entities/lang-frequency.entity';
import { Project } from './entities/project.entity';
import { User } from './entities/user.entity';
import { KeywordsQueries } from './keywords.queries';
import { KeywordsService } from './keywords.service';
import { KeywordsQueriesMock } from './mocks/keywords.queries.mock';

function getUser(id): User {
  return {
    id: id,
    email: `test${id}@gmail.com`,
    createdAt: new Date(),
  };
}

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

describe('KeywordsService', () => {
  let service: KeywordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: KeywordsQueries,
          useClass: KeywordsQueriesMock,
        },
      ],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if keyword is already added', async () => {
    const user: User = getUser(1);
    const word = 'word';
    await service.add({ keyword: word }, user);
    try {
      await service.add({ keyword: word }, user);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(400);
    }
  });

  it('should connect user to already existing keyword instead of creating new', async () => {
    const user1: User = getUser(1);
    const user2: User = getUser(2);
    const word = 'word';
    const keyword1 = await service.add({ keyword: word }, user1);
    const keyword2 = await service.add({ keyword: word }, user2);
    expect(keyword1.id).toBe(keyword2.id);
  });

  it('should throw error if update on new projects is given when no one is subscribed', async () => {
    const user: User = getUser(1);
    const word = 'word';
    const newProject: Project = getProject(1);
    const keyword = await service.add({ keyword: word }, user);
    try {
      await service.newProjectsUpdated({
        keywordId: keyword.id,
        data: [newProject],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(400);
    }
  });

  it('should throw error if update on top projects is given when no one is subscribed', async () => {
    const user: User = getUser(1);
    const word = 'word';
    const topProject: Project = getProject(1);
    const keyword = await service.add({ keyword: word }, user);
    try {
      await service.topProjectsUpdated({
        keywordId: keyword.id,
        data: [topProject],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(400);
    }
  });

  it('should throw error if update on language frequencies is given when no one is subscribed', async () => {
    const user: User = getUser(1);
    const word = 'word';
    const langFrequencies: LanguageFrequency[] = getFrequencies(1);
    const keyword = await service.add({ keyword: word }, user);
    try {
      await service.languageFrequenciesUpdated({
        keywordId: keyword.id,
        data: langFrequencies,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(400);
    }
  });

  it('should give data about new projects to user who subscribed', (done) => {
    const user: User = getUser(1);
    const newProject: Project = getProject(1);
    const word = 'word';

    const timer$ = timer(3000);
    service.add({ keyword: word }, user).then((keyword) => {
      let newProjectsUpdated = false;
      service.subscribe(user).then((obs) => {
        obs.pipe(takeUntil(timer$)).subscribe({
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
          service.newProjectsUpdated({
            keywordId: keyword.id,
            data: [newProject],
          });
        }, 2000);
      });
    });
  });

  it('should give data about top projects to user who subscribed', (done) => {
    const user: User = getUser(1);
    const topProject: Project = getProject(1);
    const word = 'word';

    const timer$ = timer(3000);
    service.add({ keyword: word }, user).then((keyword) => {
      let topProjectsUpdated = false;
      service.subscribe(user).then((obs) => {
        obs.pipe(takeUntil(timer$)).subscribe({
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
      });
      setTimeout(() => {
        service.topProjectsUpdated({
          keywordId: keyword.id,
          data: [topProject],
        });
      }, 1000);
    });
  });

  it('should give data about language frequencies to user who subscribed', (done) => {
    const user: User = getUser(1);
    const languageFrequencies: LanguageFrequency[] = getFrequencies(1);
    const word = 'word';

    const timer$ = timer(3000);
    service.add({ keyword: word }, user).then((keyword) => {
      let languageFrequenciesUpdated = false;
      service.subscribe(user).then((obs) => {
        obs.pipe(takeUntil(timer$)).subscribe({
          next: (messageEvent) => {
            const data = messageEvent.data as GithubData;
            expect(data.keyword).toBe(word);
            if (
              data.langFrequencies[0] &&
              data.langFrequencies[0].frequency ===
                languageFrequencies[0].frequency &&
              data.langFrequencies[0].language ===
                languageFrequencies[0].language
            ) {
              languageFrequenciesUpdated = true;
            }
          },
          complete: () => {
            expect(languageFrequenciesUpdated).toBe(true);
            done();
          },
        });
      });
      setTimeout(() => {
        service.languageFrequenciesUpdated({
          keywordId: keyword.id,
          data: languageFrequencies,
        });
      }, 1000);
    });
  });

  it('should cache data', async () => {
    const user1: User = getUser(1);
    const user2: User = getUser(2);
    const word = 'word';
    const newProject: Project = getProject(1);
    const timer$ = timer(3000);
    const keyword1 = await service.add({ keyword: word }, user1);
    const keyword2 = await service.add({ keyword: word }, user2);
    await service.subscribe(user1);
    expect(keyword1.id).toBe(keyword2.id);

    setTimeout(() => {
      service.newProjectsUpdated({
        data: [newProject],
        keywordId: keyword1.id,
      });
    }, 100);
    const promise = new Promise<void>((resolve) => {
      setTimeout(async () => {
        let newProjectsUpdated = false;
        const eventStream = await service.subscribe(user2);
        eventStream.pipe(takeUntil(timer$)).subscribe({
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
            resolve();
          },
        });
      }, 2000);
    });
    await promise;
  }, 20000);

  it("should not give updates to user on words he didn't add", async () => {
    const user1: User = getUser(1);
    const user2: User = getUser(2);
    const word1 = 'word1';
    const word2 = 'word2';
    const newProject: Project = getProject(1);
    const timer$ = timer(3000);
    const keyword1 = await service.add({ keyword: word1 }, user1);
    await service.add({ keyword: word2 }, user2);
    await service.subscribe(user1);
    setTimeout(() => {
      service.newProjectsUpdated({
        data: [newProject],
        keywordId: keyword1.id,
      });
    }, 500);
    const promise = new Promise<void>((resolve) => {
      setTimeout(async () => {
        let newProjectsUpdated = false;
        const eventStream = await service.subscribe(user2);
        eventStream.pipe(takeUntil(timer$)).subscribe({
          next: (messageEvent) => {
            const data = messageEvent.data as GithubData;
            expect(data.keyword).toBe(word2);
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
            expect(newProjectsUpdated).toBe(false);
            resolve();
          },
        });
      }, 50);
    });
    await promise;
  }, 20000);
});
