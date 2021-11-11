import { TestBed } from '@angular/core/testing';

import { OtrsService } from './otrs.service';

describe('OtrsService', () => {
  let service: OtrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
