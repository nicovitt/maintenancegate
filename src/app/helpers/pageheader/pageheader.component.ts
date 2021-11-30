import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pageheader',
  templateUrl: './pageheader.component.html',
  styleUrls: ['./pageheader.component.scss'],
})
export class PageheaderComponent implements OnInit {
  @Input() public headline: string = '';
  @Input() public showbackbutton: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
