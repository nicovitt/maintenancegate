import { TestBed } from '@angular/core/testing';

import { UpdateappService } from './updateapp.service';

describe('UpdateappService', () => {
  let service: UpdateappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
