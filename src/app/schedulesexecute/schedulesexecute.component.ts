import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Schedules, Step } from '../classes/schedules';
import { SchedulesComponent } from '../schedules/schedules.component';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedulesexecute',
  templateUrl: './schedulesexecute.component.html',
  styleUrls: ['./schedulesexecute.component.scss'],
})
export class SchedulesexecuteComponent implements OnInit {
  public schedule: Schedules = new Schedules();
  @ViewChild('stepstable') stepstable: MatTable<Step>;
  public stepstable_displayedColumns: string[] = [
    'actions',
    'performer',
    'position',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
  ];

  constructor(
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    if (typeof this.scheduleService.schedule == 'undefined') {
      this.router.navigate(['/schedules']);
    }
    this.schedule = this.scheduleService.schedule;
    console.log(this.schedule);
  }

  ngOnInit(): void {}
}
