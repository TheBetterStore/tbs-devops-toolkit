import { TestBed } from '@angular/core/testing';

import { ApplicationErrorService } from './application-error.service';

describe('AppliactionErrorsService', () => {
  let service: ApplicationErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
