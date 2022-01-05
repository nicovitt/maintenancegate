import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ParseService } from './services/parse.service';
import { UpdateappService } from './services/updateapp.service';
import { UserService } from './services/user.service';
import { ZammadService } from './services/zammad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'maintenancegate';
  isloggedin = false;
  public version: string = environment.version;
  @ViewChild('sidenav') private sidenav!: MatSidenav;

  constructor(
    private router: Router,
    public userService: UserService,
    public parseService: ParseService,
    public updateappService: UpdateappService
  ) {}

  ngOnInit() {}

  toggleMenuOnButton() {
    this.sidenav.toggle();
  }

  logout() {
    // Delete token in localstorage
    this.parseService.logout();
    // Hide sidenav
    this.sidenav.toggle();
    // Redirect to main view
    this.router.navigate(['/login']);
  }
}
