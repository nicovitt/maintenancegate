import { TestBed } from '@angular/core/testing';

import { UserpermissionsService } from './userpermissions.service';

describe('UserpermissionsService', () => {
  let service: UserpermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserpermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
