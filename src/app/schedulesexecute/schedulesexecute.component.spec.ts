import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesexecuteComponent } from './schedulesexecute.component';

describe('SchedulesexecuteComponent', () => {
  let component: SchedulesexecuteComponent;
  let fixture: ComponentFixture<SchedulesexecuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesexecuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesexecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
