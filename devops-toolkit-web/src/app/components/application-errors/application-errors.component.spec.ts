import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationErrorsComponent } from './application-errors.component';

describe('ApplicationErrorsComponent', () => {
  let component: ApplicationErrorsComponent;
  let fixture: ComponentFixture<ApplicationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationErrorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
