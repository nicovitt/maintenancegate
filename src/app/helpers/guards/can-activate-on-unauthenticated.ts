import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParseService } from 'src/app/services/parse.service';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class CanActivateOnUnauthenticated {
  constructor(
    private userService: UserService,
    private router: Router,
    private parseService: ParseService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.parseService.checkSession();
    return this.userService.isLoggedIn.pipe(
      map((loggedin) => {
        if (loggedin && route.routeConfig.path == 'login') {
          this.router.navigate(['/dashboard']);
        }
        return !loggedin;
      })
    );
  }
}
