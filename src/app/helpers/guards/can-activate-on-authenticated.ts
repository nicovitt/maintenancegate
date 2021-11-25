import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class CanActivateOnAuthenticated implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url,
        },
      });
      return false;
    }
  }
}
