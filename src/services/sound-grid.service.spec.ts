import { TestBed } from '@angular/core/testing';

import { SoundGridService } from './sound-grid.service';

describe('SoundGridService', () => {
  let service: SoundGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
