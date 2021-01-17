import { TestBed } from '@angular/core/testing';

import { TimerServerService } from './timer-server.service';

describe('TimerServerService', () => {
  let service: TimerServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
