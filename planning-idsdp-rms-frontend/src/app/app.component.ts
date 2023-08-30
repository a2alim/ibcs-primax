import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { locale as lngBangla } from './layout/layouts/vertical/classy/i18n/bn';
import { locale as lngEnglish } from './layout/layouts/vertical/classy/i18n/en';
import { ApiService } from './main/core/services/api/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Constructor
     */
    tokenData = [];
    constructor(private _translateService: TranslateService,
                private _http: HttpClient,
                private router: Router,
                private api: ApiService,
                ) {
        // Add languages
        this._translateService.addLangs(['en', 'bn']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Use a language
        this._translateService.use('en');

        //Set Current Lang for next time get current lang
        if(localStorage.getItem("currentLang") !== null)
        {
            localStorage.removeItem("currentLang")
        }
        localStorage.setItem("currentLang",'en')    
        
        /*--------------if get empty url----------*/
        // const parsedUrl = new URL(window.location.href);
        // const baseUrl = parsedUrl.origin;
        // var a = new String(baseUrl).length;
        // var b = new String(parsedUrl.href).length;
        // console.log('a ==', a);
        // console.log('b ==', b);
        // if((a == b) || (a+1 == b)){
        //     window.location.href = environment.ibcs.rmsResearcherLoginUrl; 
        // }
        /*--------------if get empty url----------*/
    }
    

    bool:boolean = true;
    navigation;

    ngOnInit() {
        /*--------------Set Token---------------*/       
        var url_string = window.location.href;
        var url = new URL(url_string);
        var storeSessionId = url.searchParams.get("p");
        //alert('storeSessionId ='+ storeSessionId);
        if(storeSessionId)
        {
            this.api.getToken(storeSessionId).subscribe(res => {
                sessionStorage.setItem('doptor_token', res?.doptorToken);
                this.setHeaderToken(res.accessToken);
            })        
        }
        else{
            let getToken = sessionStorage.getItem('access_token');
            if(getToken){
                this.setHeaderToken();
            }
            else{
                window.location.href = environment.ibcs.rmsResearcherLoginUrl;
            }
        } 
        /*--------------/Set Token---------------*/

    }


    setHeaderToken(accessToken=''){
        
        let headers;

        if(accessToken){            
            sessionStorage.setItem('access_token', accessToken);
            headers = new HttpHeaders().set('token', accessToken);          
        }
        else 
        {
            let getToken = sessionStorage.getItem('access_token');
            sessionStorage.setItem('access_token', getToken);
            headers = new HttpHeaders().set('token', getToken);
        }

        /*--------------**********************---------------*/
        //const headers = new HttpHeaders().set('token', this.cookieService.get('access_token'));
        //const headers = new HttpHeaders().set('token', accessToken);
        const params = new HttpParams().append('service_name', 'SSRC');

        this._http.get(environment.ibcs.baseApiEndPoint +"gateway/actions",{headers, params}).subscribe(res=>{
            console.log('resresresres = ', res);
                lngEnglish.data.ACTION=res;
            },
            (error) =>{
                console.error('error caught in component');
        });

        let enMenu = sessionStorage.getItem('enMenu');
        let v = JSON.parse(enMenu);
        if (v != null && Object.keys(v).length > 0) {
            lngEnglish.data.NAV = [];
            lngEnglish.data.NAV.push(v);
            this.bool=false; 
        }
        else{
            this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav", {headers, params}).subscribe(res => {
                sessionStorage.setItem('enMenu', JSON.stringify(res));
                lngEnglish.data.NAV = [];
                lngEnglish.data.NAV.push(res);
                this.bool=false;
            });
        }
        

        let url = window.location.pathname;

        const matched = url.match(/\d+/g);
        if(matched!=null){
            let split =  url.split("/");
            url = "/"+split[1] +"/"+ split[2];

        }
        this.getRoutePermission(url);

        let bnMenu = sessionStorage.getItem('bnMenu');
        let bnM = JSON.parse(enMenu);
        if (bnM != null && Object.keys(bnM).length > 0) {
            lngBangla.data.NAV = [];
            lngBangla.data.NAV.push(bnM);
        }
        else
        {
            this._http.get(environment.ibcs.baseApiEndPoint + "gateway/nav-bn", { headers, params }).subscribe(res => {
                // let child = {
                //     "id": 110,
                //     "title": "ড্যাশবোর্ড",
                //     "type": "basic",
                //     "icon": "dashboard",
                //     "link": "/dashboard",
                //     "menuId": null,
                //     "orders": 1,
                // };
                sessionStorage.setItem('bnMenu', JSON.stringify(res));
                lngBangla.data.NAV = [];
                lngBangla.data.NAV.push(res);
            });
        }

        
        /*--------------/**********************----------------- */
    }


    getRoutePermission(url) {
        const headers = new HttpHeaders().set('token', sessionStorage.getItem('access_token'));

        //const headers = new HttpHeaders().set('token', this.cookieService.get("access_token"));
        const params = new HttpParams().append('route_name', url);


        this._http.get(environment.ibcs.baseApiEndPoint + "gateway/route-permission", {
            headers,
            params
        }).subscribe(res => {
            console.log(res);
            if (!res)
                this.router.navigateByUrl('/error/forbidden');
        });
    }
}
