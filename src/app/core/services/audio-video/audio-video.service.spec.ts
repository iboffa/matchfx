/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AudioVideoService } from './audio-video.service';

describe('Service: AudioVideo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioVideoService]
    });
  });

  it('should ...', inject([AudioVideoService], (service: AudioVideoService) => {
    expect(service).toBeTruthy();
  }));
});
