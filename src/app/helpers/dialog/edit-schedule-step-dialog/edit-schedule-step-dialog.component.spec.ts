import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScheduleStepDialogComponent } from './edit-schedule-step-dialog.component';

describe('EditScheduleStepDialogComponent', () => {
  let component: EditScheduleStepDialogComponent;
  let fixture: ComponentFixture<EditScheduleStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditScheduleStepDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScheduleStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
