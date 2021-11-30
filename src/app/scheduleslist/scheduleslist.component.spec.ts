import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleslistComponent } from './scheduleslist.component';

describe('ScheduleslistComponent', () => {
  let component: ScheduleslistComponent;
  let fixture: ComponentFixture<ScheduleslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
