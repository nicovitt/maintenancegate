import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowScheduleExecutionDialogComponent } from './show-schedule-execution-dialog.component';

describe('ShowScheduleExecutionDialogComponent', () => {
  let component: ShowScheduleExecutionDialogComponent;
  let fixture: ComponentFixture<ShowScheduleExecutionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowScheduleExecutionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowScheduleExecutionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
