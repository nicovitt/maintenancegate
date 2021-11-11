import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinebookComponent } from './machinebook.component';

describe('MachinebookComponent', () => {
  let component: MachinebookComponent;
  let fixture: ComponentFixture<MachinebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachinebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
