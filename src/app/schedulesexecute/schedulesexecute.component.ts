import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Schedules, Step } from '../classes/schedules';
import { ParseService } from '../services/parse.service';
import { ScheduleService } from '../services/schedule.service';
import { SnackbarService } from '../services/snackbar.service';
import { GalleryComponent, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-schedulesexecute',
  templateUrl: './schedulesexecute.component.html',
  styleUrls: ['./schedulesexecute.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SchedulesexecuteComponent implements OnInit, AfterViewInit {
  public schedule: Schedules = new Schedules();
  public stepstable = new MatTableDataSource<Step>(new Array<Step>());
  public selection = new SelectionModel<Step>(true, []);
  public expandedElements: Array<Step> = new Array<Step>();
  public roles: Array<string> = [];
  public images: Array<GalleryItem> = [];
  @ViewChild(GalleryComponent) gallery: GalleryComponent;
  public stepstable_columnIndices: string[] = [
    'performer',
    'position',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
  ];
  public stepstable_columnSlugs: string[] = [
    'actions',
    'performer',
    'position',
    'protectivegear',
    'type',
    'description',
    'usedmaterial',
  ];
  public stepstable_columnNames: string[] = [
    'Ausführende Stelle',
    'Position',
    'PSA',
    'Typ',
    'Beschreibung',
    'Material',
  ];

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private parseService: ParseService,
    private snackbar: SnackbarService
  ) {
    if (typeof this.scheduleService.schedule == 'undefined') {
      this.router.navigate(['/schedules']);
    }
    this.schedule = this.scheduleService.schedule;
    this.stepstable.data = this.schedule.steps;
    console.log(this.schedule);

    this.parseService.getUserRoles().then((roles) => {
      roles.map((role: any) => {
        this.roles.push(role.get('name'));
      });
    });
  }

  ngOnInit(): void {
    this.schedule.images.forEach((image) => {
      this.images.push(new ImageItem({ src: image.data }));
    });
  }

  ngAfterViewInit() {
    this.gallery.load(this.images);
  }

  // Whether the number of selected elements matches the number of rows which can be selected by that role the user has.
  isAllSelected() {
    let numRows = 0;
    this.stepstable.data.forEach((element: Step) => {
      this.hasrole(element) ? (numRows += 1) : (numRows = numRows);
    });
    return this.selection.selected.length === numRows;
  }

  // Add or remove an element from the selection.
  addToSelection(element: Step) {
    if (this.expandedElements.includes(element)) {
      let elementindex = this.expandedElements.findIndex(
        (value) => value === element
      );
      element.done = false;
      this.expandedElements.splice(elementindex, 1);
    } else {
      element.done = true;
      this.expandedElements.push(element);
    }
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row?: Step): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  hasrole(element: Step) {
    return this.roles.some((role: string) => {
      return element.performer.includes(role);
    });
  }

  submit() {
    this.parseService
      .saveScheduleExecution(this.schedule)
      .then(
        (fullfilled) => {
          this.router.navigate(['/schedules']);
        },
        (notfullfilled) => {
          this.snackbar.opensnackbar('Fehler beim Speichern', 'OK', 10000);
        }
      )
      .catch((error) => {
        this.snackbar.opensnackbar('Fehler beim Speichern', 'OK', 10000);
      });
  }
}
