import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderFrequencyComponent } from './slider-frequency.component';

describe('SliderFrequencyComponent', () => {
  let component: SliderFrequencyComponent;
  let fixture: ComponentFixture<SliderFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
