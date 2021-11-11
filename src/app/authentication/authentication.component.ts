import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { LocalstorageService } from '../services/localstorage.service';
import { ProgressbarService } from '../services/progressbar.service';
import { ZammadService } from '../services/zammad.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  username = '';
  password = '';

  constructor(
    private zammadService: ZammadService,
    private progressbarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already logged in then redirect
    this.zammadService.checkSession().then(
      (value) => {
        if (value) {
          this.router.navigate(['/dashboard']);
        } else {
          console.log(value);
        }
      },
      (rejected) => {
        console.log(rejected);
      }
    );
  }

  login() {
    this.progressbarService.toggleProgressBar();

    // TODO: Show error message on error, Error-Handling

    this.zammadService
      .authorize(this.username, this.password)
      .then(
        (resolved) => {
          console.log(resolved);
          this.zammadService.getUser().subscribe((data) => {
            console.log(data);
            this.progressbarService.toggleProgressBar();
            // Redirect to main view
            this.router.navigate(['/dashboard']);
          });
        },
        (rejected) => {
          console.log(rejected);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }
}
