import { TestBed } from '@angular/core/testing';

import { OpenbooksApiService } from './openbooks-api.service';

describe('OpenbooksApiService', () => {
  let service: OpenbooksApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenbooksApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
