import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private _authService: AuthService, private _router: Router) {
    }

    canActivate(): boolean {
        if (this._authService.checkAccessToken()) {
            return true;
        } else {
            //    location.href = environment.ibcs.authServerUri+'sign-in';
            return true;
        }
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this._authService.checkAccessToken()) {
            return true;
        } else {
            //  location.href = environment.ibcs.authServerUri+'sign-in';
            return true;
        }
    }


}
