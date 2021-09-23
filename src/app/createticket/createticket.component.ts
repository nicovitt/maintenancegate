import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-createticket',
  templateUrl: './createticket.component.html',
  styleUrls: ['./createticket.component.scss']
})
export class CreateticketComponent implements OnInit {
  @ViewChild('categorieformcontrol', { static: true })
  categorieformcontrol!: NgModel;

  constructor() { }

  ngOnInit(): void {
  }

  ticket = {
    category: "",
  }

  categories = [
    {
      "id": 1,
      "text": "Defektes Handgerät"
    },
    {
      "id": 2,
      "text": "divider"
    }
  ]

  setFormInvalid() {
    this.categorieformcontrol.control.markAsDirty();
    this.categorieformcontrol.control.markAsTouched();
    this.categorieformcontrol.control.setErrors({ 'invalid': true, 'touched': true });
  }

}
