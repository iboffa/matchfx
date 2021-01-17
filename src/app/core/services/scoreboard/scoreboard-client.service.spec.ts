import { TestBed } from '@angular/core/testing';

import { ScoreboardClientService } from './scoreboard-client.service';

describe('ScoreboardClientService', () => {
  let service: ScoreboardClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreboardClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
