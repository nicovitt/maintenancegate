import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderDowntimeComponent } from './slider-downtime.component';

describe('SliderDowntimeComponent', () => {
  let component: SliderDowntimeComponent;
  let fixture: ComponentFixture<SliderDowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderDowntimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderDowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
