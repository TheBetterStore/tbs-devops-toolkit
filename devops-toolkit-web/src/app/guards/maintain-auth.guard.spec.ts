import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { maintainAuthGuard } from './maintain-auth.guard';

describe('maintainAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => maintainAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
