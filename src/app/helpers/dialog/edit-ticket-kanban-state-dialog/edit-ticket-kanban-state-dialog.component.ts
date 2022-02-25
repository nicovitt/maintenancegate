import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Kanban_Column } from 'src/app/classes/kanban';
import { Ticket } from 'src/app/classes/ticket';

@Component({
  selector: 'app-edit-ticket-kanban-state-dialog',
  templateUrl: './edit-ticket-kanban-state-dialog.component.html',
  styleUrls: ['./edit-ticket-kanban-state-dialog.component.scss'],
})
export class EditTicketKanbanStateDialogComponent implements OnInit {
  public newstate: number = 0;
  public description: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditTicketKanbanStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { ticket: Ticket; states: Array<Kanban_Column> }
  ) {
    console.log(this.data);
    this.newstate = this.data.ticket.kanban_state;
  }

  ngOnInit(): void {}

  submitChanges() {
    this.data.ticket.kanban_state = this.newstate;
    this.dialogRef.close({
      ticket: this.data.ticket,
      description: this.description,
    });
  }

  onCloseClick() {
    this.dialogRef.close(new Error('Dialog geschlossen.'));
  }
}
