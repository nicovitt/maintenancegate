import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit {
  public showprogressbar: boolean = true;

  constructor(private progressbarService: ProgressbarService) {}

  ngOnInit(): void {
    this.progressbarService.currentState.subscribe((newstate) => {
      this.showprogressbar = newstate;
    });
  }
}
