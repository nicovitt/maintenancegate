import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { ParseService } from '../services/parse.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private parseService: ParseService
  ) {}

  ngOnInit(): void {}

  login() {
    this.parseService
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
      .catch((error) => {
        this.dialogService.presentError$({
          header: '',
          title: 'Login-Error',
          message: 'Entschuldigung, es ist ein Fehler aufgetreten.',
        });
      });
  }
}
