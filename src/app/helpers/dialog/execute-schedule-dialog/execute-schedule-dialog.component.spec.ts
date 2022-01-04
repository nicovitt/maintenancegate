import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteScheduleDialogComponent } from './execute-schedule-dialog.component';

describe('ExecuteScheduleDialogComponent', () => {
  let component: ExecuteScheduleDialogComponent;
  let fixture: ComponentFixture<ExecuteScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
