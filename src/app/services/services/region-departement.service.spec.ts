import { TestBed } from '@angular/core/testing';

import { RegionDepartementService } from './region-departement.service';

describe('RegionDepartementService', () => {
  let service: RegionDepartementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionDepartementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
