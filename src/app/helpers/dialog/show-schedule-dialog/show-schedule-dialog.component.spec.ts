import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowScheduleDialogComponent } from './show-schedule-dialog.component';

describe('ShowScheduleDialogComponent', () => {
  let component: ShowScheduleDialogComponent;
  let fixture: ComponentFixture<ShowScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
