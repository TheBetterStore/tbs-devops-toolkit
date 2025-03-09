import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationErrorCodesComponent } from './application-error-codes.component';

describe('ApplicationErrorCodesComponent', () => {
  let component: ApplicationErrorCodesComponent;
  let fixture: ComponentFixture<ApplicationErrorCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationErrorCodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationErrorCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
