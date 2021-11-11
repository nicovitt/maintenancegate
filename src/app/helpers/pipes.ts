import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { startWith, map } from 'rxjs/operators';
import { Workplacecategory } from '../classes/workplacecategory';
import { ParseService } from '../services/parse.service';

@Pipe({ name: 'sanitizeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Pipe({ name: 'workplaceidtoname' })
export class WorkplaceIdToName implements PipeTransform {
  constructor() {}
  transform(value: number, workplaces: Workplacecategory[]) {
    return workplaces.find((workplace) => {
      return workplace.title == value + ''
        ? workplace.title + ' ' + workplace.description
        : '';
    });
  }
}
