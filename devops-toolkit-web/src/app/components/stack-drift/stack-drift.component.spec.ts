import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackDriftComponent } from './stack-drift.component';

describe('StackDriftComponent', () => {
  let component: StackDriftComponent;
  let fixture: ComponentFixture<StackDriftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackDriftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StackDriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
