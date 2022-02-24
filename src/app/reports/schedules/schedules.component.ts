import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedules, Schedules_Execution } from 'src/app/classes/schedules';
import { Workplacecategory } from 'src/app/classes/workplacecategory';
import { DialogService } from 'src/app/services/dialog.service';
import { FilterService } from 'src/app/services/filter.service';
import { ParseService } from 'src/app/services/parse.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  public workplacesWithSchedules = new Array<{
    workplace: Workplacecategory;
    schedules: Array<Schedules>;
  }>();
  public filteredWorkplaces = new Array<any>();
  public displayedColumns: string[] = ['title', 'description', 'action'];

  constructor(
    private parseService: ParseService,
    private router: Router,
    public filterService: FilterService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.filterService.searchString = '';

    this.parseService.getWorkplaceCategories().then((workplaces) => {
      workplaces.forEach((workplace) => {
        this.parseService
          .getSchedulesAndExecution(workplace.id)
          .then((schedules: Array<Schedules>) => {
            let tmp = {
              workplace: workplace,
              schedules: schedules,
            };
            this.workplacesWithSchedules.push(tmp);
            this.filteredWorkplaces.push(tmp);
          });
      });
    });

    this.filterService._searchtextChange.subscribe(() => {
      this.filteredWorkplaces =
        this.filterService.filterWorkplacesWithSchedules(
          this.workplacesWithSchedules
        );
    });
  }

  showscheduleexecution(schedule: Schedules) {
    this.dialogService.showScheduleExecution(schedule);
  }

  exportscheduleexecution(schedule: Schedules) {
    console.log(schedule);
  }
}
