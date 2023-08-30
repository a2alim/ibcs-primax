import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { AuthService } from "./main/modules/auth/services/auth.service";
import { CookieService } from "ngx-cookie-service";
import { locale as lngEnglish } from './layout/layouts/vertical/classy/i18n/en';
import { locale as lngBangla } from './layout/layouts/vertical/classy/i18n/bn';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(private _translateService: TranslateService,
        private router: Router, private _authService: AuthService, private _http: HttpClient, private cookieService: CookieService) {
        // Add languages
        this._translateService.addLangs(['en', 'bn']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Use a language
        this._translateService.use('en');
    }

    bool: boolean = true;
    navigation;

    ngOnInit() {
        /*--------------Set Token---------------*/
        let url_string = window.location.href;
        let url = new URL(url_string);
        let storeSessionId = url.searchParams.get("p");

        if(storeSessionId) {
            sessionStorage.setItem('sessionId', storeSessionId);

            this._authService.getToken(storeSessionId).subscribe(res => {
                this.setHeaderToken(res.accessToken);
                sessionStorage.setItem('doptor_token', res.doptorToken);
            })
        } else {
            let getToken = sessionStorage.getItem('access_token');
            if(getToken){
                this.setHeaderToken();
            } else{
                window.location.href = environment.ibcs.ppsLoginUrl;
            }
        }

        /*--------------/Set Token---------------*/

    }

    setHeaderToken(accessToken = '') {
        let headers;

        if(accessToken){
            sessionStorage.setItem('access_token', accessToken);
            headers = new HttpHeaders().set('token', accessToken);
        } else {
            let getToken = sessionStorage.getItem('access_token');
            sessionStorage.setItem('access_token', getToken);
            headers = new HttpHeaders().set('token', getToken);
        }

        /*--------------**********************---------------*/
        const params = new HttpParams().append('service_name', 'PPS');
        this._http.get(environment.ibcs.baseApiEndPoint + "gateway/actions", {headers, params}).subscribe(res => {

                lngEnglish.data.ACTION = res;
                lngBangla.data.ACTION = res;
            },
            (error) => {
                location.href = environment.ibcs.authUiUrl + 'sign-out';
            })

        this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav", {headers, params}).subscribe(res => {

            let child = {
                "id": 110,
                "title": "Dashboard",
                "type": "basic",
                "icon": "dashboard",
                "link": "/dashboard",
                "menuId": null,
                "orders": 1,
            };
            lngEnglish.data.NAV = [];
            lngEnglish.data.NAV.push(res);
            lngEnglish.data.NAV.forEach(nav => {
                if (nav.children) {
                    nav.children.unshift(child);
                }
            })
            this.bool = false;
        });

        let url = window.location.pathname;

        const matched = url.match(/\d+/g);
        if (matched != null) {
            let split = url.split("/");
            url = "/" + split[1] + "/" + split[2];

        }
        this.getRoutePermission(url);

        this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav-bn", {headers, params}).subscribe(res => {

            let child = {
                "id": 110,
                "title": "ড্যাশবোর্ড",
                "type": "basic",
                "icon": "dashboard",
                "link": "/dashboard",
                "menuId": null,
                "orders": 1,
            };
            lngBangla.data.NAV = [];
            lngBangla.data.NAV.push(res);
            lngBangla.data.NAV.forEach(nav => {
                if (nav.children) {
                    nav.children.unshift(child);
                }
            });
        });

        /*--------------/**********************----------------- */
    }

    ngOnInit2() {
        const headers = new HttpHeaders().set('token', sessionStorage.getItem('access_token'));
        const params = new HttpParams().append('service_name', 'PPS');


        if (this._authService.checkAccessToken()) {

            this._http.get(environment.ibcs.baseApiEndPoint + "gateway/actions", { headers, params }).subscribe(res => {

                lngEnglish.data.ACTION = res;

                lngBangla.data.ACTION = res;

            },
                (error) => {
                    location.href = environment.ibcs.authUiUrl + 'sign-out';
                })

            this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav", { headers, params }).subscribe(res => {

                let child = {
                    "id": 110,
                    "title": "Dashboard",
                    "type": "basic",
                    "icon": "dashboard",
                    "link": "/dashboard",
                    "menuId": null,
                    "orders": 1,

                };
                lngEnglish.data.NAV = [];
                lngEnglish.data.NAV.push(res);
                lngEnglish.data.NAV.forEach(nav => {
                    nav.children.unshift(child);
                })
            });

            let url = window.location.pathname;

            const matched = url.match(/\d+/g);
            if (matched != null) {
                let split = url.split("/");
                url = "/" + split[1] + "/" + split[2];

            }
            this.getRoutePermission(url);


            this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav-bn", { headers, params }).subscribe(res => {

                let child = {
                    "id": 110,
                    "title": "ড্যাশবোর্ড",
                    "type": "basic",
                    "icon": "dashboard",
                    "link": "/dashboard",
                    "menuId": null,
                    "orders": 1,

                };
                lngBangla.data.NAV = [];
                lngBangla.data.NAV.push(res);
                lngBangla.data.NAV.forEach(nav => {
                    nav.children.unshift(child);
                });
            });

        }
        else
            location.href = environment.ibcs.authUiUrl+'sign-out';
    }

    getRoutePermission(url) {
        const headers = new HttpHeaders().set('token', sessionStorage.getItem('access_token'));
        const params = new HttpParams().append('route_name', url);


        this._http.get(environment.ibcs.baseApiEndPoint + "gateway/route-permission", {
            headers,
            params
        }).subscribe(res => {
            if (!res)
                this.router.navigateByUrl('/error/forbidden');
        });
    }


}
