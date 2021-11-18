import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyprogressbarComponent } from './fancyprogressbar.component';

describe('FancyprogressbarComponent', () => {
  let component: FancyprogressbarComponent;
  let fixture: ComponentFixture<FancyprogressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyprogressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyprogressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
