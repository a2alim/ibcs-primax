import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';

// Service
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {DataComService} from '../data-com/data-com.service';
import {filter, pairwise} from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private baseUrl = '';
  private apiUrl = '';
  private subscription: Subscription;
  accessToken = '';
  authUrl = false;
  accessablePath = [
    "/",    
  ];

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
    private dataCom: DataComService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    
  ) {

  }

  // public getTemToken() {
  //   return this.accessToken;
  // }

  getTemToken(){
    return this.storage.getAccessToken();
  }


  logout(): void {
    if (this.isAuthorized()) {
      this.storage.clear();
      this.storage.clearFilterData();
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/');
    }
  }

  public isAuthorized(): boolean {
    const token = this.storage.getAccessToken();
    this.checkedPermission();
    return !!token;
  }

  public checkedPermission() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.subscription = this.dataCom.getPassedItemData.subscribe(res => {
          if (Array.isArray(res)) {
            let permissionData = res.filter(data => {
              data.permissions.filter(menu => {
                //console.log("match", event.url.indexOf(menu.path), menu.path, event.url);
                if (event.url.includes(menu.path)) {

                  //this.router.navigate(['/dashboard/unauthorized-access']);
                  this.authUrl = true;
                  return data;
                } else {
                  //this.authUrl = true;
                  // this.router.navigate(['/dashboard/unauthorized-access']);
                }
              })
            })
            if (!this.authUrl && this.accessablePath.indexOf(event.url) == -1) {
              this.router.navigate(['/dashboard/unauthorized-access']);
            }
          }

        })
      }
    });
  }

  public getAuthHeader() {
    const headers = new HttpHeaders().set('Authorization', 'bearer ' + this.storage.getAccessToken());
    if (headers) {
      return headers;
    }
  }

  public getMultipleHeader() {
    const headers = new HttpHeaders()
      .set('Authorization', 'bearer ' + this.storage.getAccessToken())
      .set('doptor_token', this.storage.getDoptorToken());
    if (headers) {
      return headers;
    }
  }

  public refreshToken(): any {
    //
  }

  public me(): Observable<any> {
    return this.http.get(this.baseUrl + '/api/auth/me', {headers: this.getAuthHeader()});
  }

  public saveAccessData(accessToken) {
    this.storage
      .setAccessToken(accessToken);
  }

  public dateDiff(fromDate, toDate) {
    const date1 = fromDate;
    const date2 = toDate;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  clearFilterData() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .pipe(pairwise())
      .subscribe((e) => {
        let previousUrl = e[0]["urlAfterRedirects"];
        let currentUrl = e[1]["urlAfterRedirects"];
        if (currentUrl != previousUrl && (!currentUrl.includes(previousUrl) && !previousUrl.includes(currentUrl))) {
          this.storage.clearFilterData();
        }
      });
  }

  public postingType = {
   
  }

}
