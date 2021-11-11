import { TestBed } from '@angular/core/testing';

import { OtrsticketsService } from './otrstickets.service';

describe('OtrsticketsService', () => {
  let service: OtrsticketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtrsticketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
