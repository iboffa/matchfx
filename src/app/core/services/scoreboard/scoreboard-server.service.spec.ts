import { TestBed } from '@angular/core/testing';

import { ScoreboardServerService } from './scoreboard-server.service';

describe('ScoreboardServerService', () => {
  let service: ScoreboardServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreboardServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
