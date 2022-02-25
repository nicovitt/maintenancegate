import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketKanbanStateDialogComponent } from './edit-ticket-kanban-state-dialog.component';

describe('EditTicketKanbanStateDialogComponent', () => {
  let component: EditTicketKanbanStateDialogComponent;
  let fixture: ComponentFixture<EditTicketKanbanStateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTicketKanbanStateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketKanbanStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
