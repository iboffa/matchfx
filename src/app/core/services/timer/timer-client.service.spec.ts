import { TestBed } from '@angular/core/testing';

import { TimerClientService } from './timer-client.service';

describe('TimerClientService', () => {
  let service: TimerClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
