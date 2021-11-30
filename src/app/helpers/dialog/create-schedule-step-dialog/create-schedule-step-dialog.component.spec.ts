import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScheduleStepDialogComponent } from './create-schedule-step-dialog.component';

describe('CreateScheduleStepDialogComponent', () => {
  let component: CreateScheduleStepDialogComponent;
  let fixture: ComponentFixture<CreateScheduleStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateScheduleStepDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScheduleStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
