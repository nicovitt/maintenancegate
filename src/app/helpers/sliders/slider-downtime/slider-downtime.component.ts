import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'slider-downtime',
  templateUrl: './slider-downtime.component.html',
  styleUrls: ['./slider-downtime.component.scss'],
})
export class SliderDowntimeComponent implements OnInit {
  @Input() public form: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  formatLabel(value: number | null) {
    switch (value) {
      case 0:
        return 'Minuten';
      case 25:
        return 'Stunden';
      case 50:
        return 'Schichten';
      case 75:
        return 'Tage';
      case 100:
        return 'Wochen';
      default:
        return '';
    }
  }
}
