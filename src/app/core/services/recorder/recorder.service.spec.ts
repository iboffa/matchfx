/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecorderService } from './recorder.service';

describe('Service: Recorder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecorderService]
    });
  });

  it('should ...', inject([RecorderService], (service: RecorderService) => {
    expect(service).toBeTruthy();
  }));
});
