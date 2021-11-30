import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteScheduleDialogComponent } from './delete-schedule-dialog.component';

describe('DeleteScheduleDialogComponent', () => {
  let component: DeleteScheduleDialogComponent;
  let fixture: ComponentFixture<DeleteScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
