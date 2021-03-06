import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedules } from '../classes/schedules';
import { Workplacecategory } from '../classes/workplacecategory';
import { WorkplaceIdToName } from '../helpers/pipes/pipes';
import { DialogService } from '../services/dialog.service';
import { ParseService } from '../services/parse.service';
import { ProgressbarService } from '../services/progressbar.service';
import { ScheduleService } from '../services/schedule.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-scheduleslist',
  templateUrl: './scheduleslist.component.html',
  styleUrls: ['./scheduleslist.component.scss'],
})
export class ScheduleslistComponent implements OnInit {
  public workplace: Workplacecategory = new Workplacecategory();
  public displayedColumns: string[] = ['name', 'description', 'actions'];
  public scheduledplans: Array<Schedules> = [];
  @ViewChild(MatTable) table: MatTable<Workplacecategory>;

  constructor(
    private route: ActivatedRoute,
    private parseService: ParseService,
    private progressbar: ProgressbarService,
    private pipe_workplaceidtoname: WorkplaceIdToName,
    private dialogService: DialogService,
    private scheduleService: ScheduleService,
    private router: Router,
    private snackbar: SnackbarService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.parseService.getWorkplaceCategories().then(
        (value) => {
          this.workplace = this.pipe_workplaceidtoname.transform(
            params['id'],
            value
          );
        },
        (rejected) => {}
      );

      this.parseService.getSchedules(parseInt(params['id'])).then(
        (value) => {
          this.scheduledplans = value;
          this.table.renderRows();
          // Turn off the progressbar if still visible
          if (this.progressbar.getshowprogressbar()) {
            this.progressbar.toggleProgressBar();
          }
        },
        (rejected) => {}
      );
    });
  }

  showSteps(schedule: Schedules) {
    this.dialogService.showSchedule(schedule);
  }

  addPlan(workplaceid: number) {
    // if (!this.userService.caneditschedule) {
    //   return;
    // }
    this.scheduleService.schedule = new Schedules();
    this.router.navigate(['/schedules/create', workplaceid]);
  }

  editPlan(schedule: Schedules) {
    // if (!this.userService.caneditschedule) {
    //   return;
    // }
    this.scheduleService.schedule = schedule;
    this.router.navigate(['/schedules/create', schedule.workplaceid]);
  }

  executePlan(schedule: Schedules) {
    this.dialogService
      .executeSchedule(schedule)
      .afterClosed()
      .subscribe((value) => {
        if (!value) {
          return;
        }
        this.scheduleService.schedule = schedule;
        this.router.navigate(['schedules/execute', schedule.workplaceid]);
      });
  }

  deletePlan(scheduletodelete: Schedules) {
    // if (!this.userService.caneditschedule) {
    //   return;
    // }
    this.dialogService
      .deleteSchedule(scheduletodelete)
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.parseService
            .deleteSchedule(scheduletodelete)
            .then(
              (fullfilled: Schedules) => {
                if (fullfilled) {
                  this.scheduledplans.splice(
                    this.scheduledplans.findIndex((value) => {
                      value == scheduletodelete;
                    }),
                    1
                  );

                  this.table.renderRows();
                } else {
                  this.snackbar.opensnackbar(
                    'Der Wartungsplan konnte nicht gel??scht werden.',
                    'OK',
                    10000
                  );
                }
              },
              () => {
                this.snackbar.opensnackbar(
                  'Der Wartungsplan konnte nicht gel??scht werden.',
                  'OK',
                  10000
                );
              }
            )
            .catch(() => {
              this.snackbar.opensnackbar(
                'Der Wartungsplan konnte nicht gel??scht werden.',
                'OK',
                10000
              );
            });
        }
      });
  }
}
