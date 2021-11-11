import { TestBed } from '@angular/core/testing';

import { ZammadService } from './zammad.service';

describe('ZammadService', () => {
  let service: ZammadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZammadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
