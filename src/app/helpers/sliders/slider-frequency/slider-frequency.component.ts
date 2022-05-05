import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'slider-frequency',
  templateUrl: './slider-frequency.component.html',
  styleUrls: ['./slider-frequency.component.scss'],
})
export class SliderFrequencyComponent implements OnInit {
  @Input() public form: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  formatLabel(value: number | null) {
    switch (value) {
      case 0:
        return 'Nie';
      case 25:
        return 'Selten';
      case 50:
        return 'Regelmäßig';
      case 75:
        return 'Häufig';
      case 100:
        return 'Immer';
      default:
        return '';
    }
  }
}
