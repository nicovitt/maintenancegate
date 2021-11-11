import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ZammadService } from './services/zammad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'maintenancegate';
  isloggedin = false;
  @ViewChild('drawer') private drawer!: MatDrawer;

  constructor(private zammadService: ZammadService, private router: Router) {}

  ngOnInit() {
    this.zammadService.checkSession().then(
      (value) => {
        if (value) {
          this.isloggedin = true;
        }
      },
      (rejected) => {}
    );
  }

  toggleMenuOnButton() {
    this.drawer.toggle();
  }

  logout() {
    // Delete token in localstorage
    this.zammadService.logout();
    // Hide drawer
    this.drawer.toggle();
    // Redirect to main view
    this.router.navigate(['/login']);
  }
}
