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
import { DialogService } from '../services/dialog.service';
import { LocalstorageService } from '../services/localstorage.service';
import { ProgressbarService } from '../services/progressbar.service';
import { UserService } from '../services/user.service';
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
    private userService: UserService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  login() {
    this.userService
      .login(this.username.trim(), this.password.trim())
      .then((value) => {
        if (value) {
          this.router.navigate(['/dashboard']);
        } else {
          this.dialogService.presentError$({
            header: '',
            title: 'Login-Error',
            message: 'Entschuldigung, wir konnten Sie nicht anmelden.',
          });
        }
      })
      .catch(() => {
        this.dialogService.presentError$({
          header: '',
          title: 'Login-Error',
          message: 'Entschuldigung, wir konnten Sie nicht anmelden.',
        });
      });
  }
}
