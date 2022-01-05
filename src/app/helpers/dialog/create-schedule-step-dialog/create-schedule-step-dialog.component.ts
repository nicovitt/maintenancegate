import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/classes/schedules';

@Component({
  selector: 'app-create-schedule-step-dialog',
  templateUrl: './create-schedule-step-dialog.component.html',
  styleUrls: ['./create-schedule-step-dialog.component.scss'],
})
export class CreateScheduleStepDialogComponent implements OnInit {
  public stepsForm: FormGroup;
  public typeselectList: any[] = [
    { name: 'Aktion', icon: 'construction' },
    { name: 'Visuell', icon: 'visibility' },
    { name: 'Auffüllen', icon: 'format_color_fill' },
    { name: 'Entlüften/Leeren', icon: 'air' },
    { name: 'Austausch', icon: 'sync_alt' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateScheduleStepDialogComponent>
  ) {}

  ngOnInit(): void {
    this.stepsForm = this._formBuilder.group({
      performer: ['', Validators.required],
      position: ['', Validators.required],
      protectivegear: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      usedmaterial: ['', Validators.required],
    });
  }

  submitChanges() {
    let step = new Step();
    step.position = this.stepsForm.get('position').value;
    step.protectivegear = this.stepsForm.get('protectivegear').value;
    step.type = this.stepsForm.get('type').value;
    step.description = this.stepsForm.get('description').value;
    step.usedmaterial = this.stepsForm.get('usedmaterial').value;

    if (this.stepsForm.valid) {
      this.dialogRef.close(step);
    } else {
      Object.keys(this.stepsForm.controls).forEach((key) => {
        if (this.stepsForm.get(key).invalid) {
          this.stepsForm.get(key).setErrors({ incorrect: true });
        }
      });
    }
  }

  onCloseClick() {
    this.dialogRef.close(new Error('Schritt-hinzufügen-Dialog geschlossen.'));
  }
}