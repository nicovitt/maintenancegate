import { Component, OnInit } from '@angular/core';
import { Kanban_Column } from 'src/app/classes/kanban';
import { FancyprogressbarService } from 'src/app/services/fancyprogressbar.service';
import { ParseService } from 'src/app/services/parse.service';

var ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-fancyprogressbar',
  templateUrl: './fancyprogressbar.component.html',
  styleUrls: ['./fancyprogressbar.component.scss'],
})
export class FancyprogressbarComponent implements OnInit {
  private line: any;
  private kanbanstates: Kanban_Column[] = new Array<Kanban_Column>();

  constructor(
    private parseService: ParseService,
    private fancyprogressbarService: FancyprogressbarService
  ) {}

  ngOnInit(): void {
    this.parseService.getKanbanColumns().then((data) => {
      this.kanbanstates = data;
      this.fancyprogressbarService.animationState.subscribe(
        (state_of_ticket: number) => {
          if (this.kanbanstates.length > 0) {
            let index = this.kanbanstates.findIndex(
              (state) => state.id == state_of_ticket
            );
            if (index != -1) {
              this.line.setText(
                'Ticket befindet sich in: ' + this.kanbanstates[index].label
              );
              // TODO: Here is a map error.
              this.line.animate(index + 1 / this.kanbanstates.length);
            }
          }
        }
      );
      this.fancyprogressbarService.changeKanbanState();
    });

    this.line = new ProgressBar.Line('#progressbar-container', {
      strokeWidth: 1,
      color: '#000',
      trailColor: '#eee',
      trailWidth: 1,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: null,
      text: {
        value: '',
        alignToBottom: false,
      },
      from: { color: '#c72020' },
      to: { color: '#41c720' },
      step: (state: any, bar: any) => {
        bar.path.setAttribute('stroke', state.color);
        var value = Math.round(bar.value() * 100);
        // bar.text.style.color = state.color;
      },
    });
    this.line.text.style.fontSize = '1.5rem';
  }
}
