import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulescreateeditComponent } from './schedulescreateedit.component';

describe('SchedulescreateeditComponent', () => {
  let component: SchedulescreateeditComponent;
  let fixture: ComponentFixture<SchedulescreateeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulescreateeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulescreateeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
