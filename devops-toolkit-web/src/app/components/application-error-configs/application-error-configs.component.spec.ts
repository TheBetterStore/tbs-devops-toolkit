import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationErrorConfigsComponent } from './application-error-configs.component';

describe('ApplicationErrorConfigsComponent', () => {
  let component: ApplicationErrorConfigsComponent;
  let fixture: ComponentFixture<ApplicationErrorConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationErrorConfigsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationErrorConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
