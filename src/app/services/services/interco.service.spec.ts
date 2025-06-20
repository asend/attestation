import { TestBed } from '@angular/core/testing';

import { IntercoService } from './interco.service';

describe('IntercoService', () => {
  let service: IntercoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntercoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
