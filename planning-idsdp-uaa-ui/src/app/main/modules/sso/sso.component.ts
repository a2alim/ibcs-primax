import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthUtils} from 'app/main/core/auth/auth.utils';
import {CookieService} from 'ngx-cookie-service';
import {SsoVerifyService} from './services/sso-verify.service';

@Component({
    selector: 'app-sso',
    templateUrl: './sso.component.html',
    styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit {

    activationNeed: boolean;


    constructor(private _route: ActivatedRoute, private _router: Router, private cookieService: CookieService, private ssoVerifyService: SsoVerifyService) {
        // const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
        // const username = decodedToken.user_id;
        // this.ssoVerifyService.ssoUserVerify(username, '').subscribe(res => {
        //     console.log(res);
        //     if (res.status == 201 || res.status == 202)
        //         this.activationNeed = true;
        //     else if (res.status == 200) {
        //         const doptor_token = this.cookieService.get('access_token');
        //         this.cookieService.set('doptor_token', doptor_token, null, '/');
        //         this.cookieService.set('access_token', res.body.access_token, null, '/');
        //         this._router.navigate(['navigation']);
        //     }
        // });
    }

    ngOnInit(): void {
        console.log(this._route.snapshot);
    }

    signOut(): void{
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('doptor_token');

        this.cookieService.deleteAll();

        this._router.navigate(['/sign-in']);
    }

}
