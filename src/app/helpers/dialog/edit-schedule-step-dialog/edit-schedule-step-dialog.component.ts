import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Step } from 'src/app/classes/schedules';
import { CreateScheduleStepDialogComponent } from '../create-schedule-step-dialog/create-schedule-step-dialog.component';

// TODO: Should be combined with create-schedule-step-dialog

@Component({
  selector: 'app-edit-schedule-step-dialog',
  templateUrl: './edit-schedule-step-dialog.component.html',
  styleUrls: ['./edit-schedule-step-dialog.component.scss'],
})
export class EditScheduleStepDialogComponent implements OnInit {
  public stepsForm: FormGroup;
  public roles: any = [];
  public typeselectList: any[] = [
    { name: 'Aktion', icon: 'construction' },
    { name: 'Visuell', icon: 'visibility' },
    { name: 'Auffüllen', icon: 'format_color_fill' },
    { name: 'Entlüften/Leeren', icon: 'air' },
    { name: 'Austausch', icon: 'sync_alt' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateScheduleStepDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roles: Array<any>; step: Step }
  ) {
    this.roles = data.roles;
    console.log(data);
  }

  ngOnInit(): void {
    this.stepsForm = this._formBuilder.group({
      position: [this.data.step.position, Validators.required],
      protectivegear: [this.data.step.protectivegear, Validators.required],
      type: [this.data.step.type, Validators.required],
      description: [this.data.step.description, Validators.required],
      usedmaterial: [this.data.step.usedmaterial, Validators.required],
      performer: [this.data.step.performer],
    });
  }

  submitChanges() {
    this.data.step.position = this.stepsForm.get('position').value;
    this.data.step.protectivegear = this.stepsForm.get('protectivegear').value;
    this.data.step.type = this.stepsForm.get('type').value;
    this.data.step.description = this.stepsForm.get('description').value;
    this.data.step.usedmaterial = this.stepsForm.get('usedmaterial').value;
    this.data.step.performer = this.stepsForm.get('performer').value;

    if (this.stepsForm.valid) {
      this.dialogRef.close(this.data.step);
    } else {
      Object.keys(this.stepsForm.controls).forEach((key) => {
        if (this.stepsForm.get(key).invalid) {
          this.stepsForm.get(key).setErrors({ incorrect: true });
        }
      });
    }
  }

  onCloseClick() {
    this.dialogRef.close(new Error('Dialog geschlossen.'));
  }
}
