import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Workplacecategory } from '../../classes/workplacecategory';

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

@Pipe({ name: 'safehtmlforimage' })
export class SafeHtmlForImagePipe {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}

@Pipe({
  name: 'sanitizeurl',
})
export class SanitizeUrlPipe {
  constructor(private _sanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustUrl(html);
  }
}

@Pipe({
  name: 'reverseArray',
})
export class ReverseArraylPipe {
  transform(array: any[]) {
    return array.slice().reverse();
  }
}

@Pipe({ name: 'formatLabelDowntimeLong' })
export class FormatLabelDowntimeLongPipe {
  transform(value: string) {
    switch (parseInt(value)) {
      case 25:
        return 'Minuten';
      case 50:
        return 'Stunden';
      case 75:
        return 'Schichten';
      case 100:
        return 'Wochen';
      default:
        return '';
    }
  }
}

@Pipe({ name: 'formatLabelDowntimeShort' })
export class FormatLabelDowntimeShortPipe {
  transform(value: string) {
    switch (parseInt(value)) {
      case 25:
        return 'Min.';
      case 50:
        return 'Std.';
      case 75:
        return 'Schi.';
      case 100:
        return 'Wo.';
      default:
        return '';
    }
  }
}

@Pipe({ name: 'formatLabelRestriction' })
export class FormatLabelRestrictionPipe {
  transform(value: string) {
    switch (parseInt(value)) {
      case 1:
        return 'Keine Einschränkungen';
      case 2:
        return 'Vorerst in Ordnung';
      case 3:
        return 'Ich kann nicht mehr arbeiten';
      default:
        return '';
    }
  }
}
