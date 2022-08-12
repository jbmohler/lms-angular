import { TestBed } from '@angular/core/testing';

import { OpenbooksFormsService } from './openbooks-forms.service';

describe('OpenbooksFormsService', () => {
  let service: OpenbooksFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenbooksFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
