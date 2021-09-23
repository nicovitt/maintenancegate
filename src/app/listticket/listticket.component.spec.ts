import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListticketComponent } from './listticket.component';

describe('ListticketComponent', () => {
  let component: ListticketComponent;
  let fixture: ComponentFixture<ListticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListticketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
