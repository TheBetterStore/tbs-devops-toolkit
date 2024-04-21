import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { viewAuthGuard } from './view-auth.guard';

describe('viewAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => viewAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
