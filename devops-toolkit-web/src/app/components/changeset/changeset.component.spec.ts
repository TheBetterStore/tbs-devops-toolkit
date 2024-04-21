import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesetComponent } from './changeset.component';

describe('ChangesetComponent', () => {
  let component: ChangesetComponent;
  let fixture: ComponentFixture<ChangesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangesetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
