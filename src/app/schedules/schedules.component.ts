import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Workplacecategory } from '../classes/workplacecategory';
import { WorkplaceTitleToName } from '../helpers/pipes/pipes';
import { DialogService } from '../services/dialog.service';
import { ParseService } from '../services/parse.service';
import { ProgressbarService } from '../services/progressbar.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];
  public Workplacecategories: Array<Workplacecategory> = [];
  @ViewChild(MatTable) table: MatTable<Workplacecategory>;

  constructor(
    private parseService: ParseService,
    private progressbar: ProgressbarService
  ) {}

  ngOnInit(): void {
    this.parseService.getWorkplaceCategories().then(
      (value) => {
        this.Workplacecategories = value;
        this.table.renderRows();
        // Turn off the progressbar if still visible
        if (this.progressbar.getshowprogressbar()) {
          this.progressbar.toggleProgressBar();
        }
      },
      (rejected) => {}
    );
  }
}
