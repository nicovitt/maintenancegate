import { TestBed } from '@angular/core/testing';

import { FancyprogressbarService } from './fancyprogressbar.service';

describe('FancyprogressbarService', () => {
  let service: FancyprogressbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FancyprogressbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
