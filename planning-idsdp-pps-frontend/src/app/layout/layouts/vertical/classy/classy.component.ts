import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {FuseNavigationService} from '@fuse/components/navigation';
import {InitialData} from 'app/app.types';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../main/core/services/translation-loader.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {environment, gateWayBaseEndPoint} from 'environments/environment';
import {UserProfileService} from "../../../../main/modules/auth/services/user.profile.service";
import {LayoutHelperService} from '../services/layout-helper.service';
import {UserGroupService} from "../../../../main/modules/configuration-management/services/user-group.service";
import {ViewportScroller} from "@angular/common";

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    pageYoffset = 0;
    @HostListener('window:scroll', ['$event']) onScroll(event){
        this.pageYoffset = window.pageYOffset;
    }
    data: InitialData;
    isScreenSmall: boolean;
    selectedLanguage: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation;
    userName: any;
    email: any;
    designation: string;
    userGroupName: string;
    ministryName: string;
    userGroupDesc: string;
    profileImageUrl: any;
    signatureImageUrl: any;
    imageUrlEndPoint = environment.ibcs.authServerBackendEndpoint;
    actionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    actionData = this.actionSubject.asObservable();
    hideButton: boolean;
    isPublicDashboard: boolean;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _translateService: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _http: HttpClient,
        private cookieService: CookieService,
        private userProfileService: UserProfileService,
        private layoutHelperService: LayoutHelperService,
        private userGroupService: UserGroupService,
        private scroll: ViewportScroller
    ) {
        this.selectedLanguage = _fuseTranslationLoaderService.getActiveLang();
        this.navLanguageSwitcher(this.selectedLanguage);
        this.navLanguageSwitcher('en');
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
        let url_string = window.location.href;
        let url = new URL(url_string);
        if (url.pathname == '/dpp-tapp/public-dashboard' || url.pathname == '/dpp-tapp/public-psc') {
            this.isPublicDashboard = true;
        }

        this.loadStateData();
        this.getUserProfileInfo();
        this.getUserGroupByUserId();
        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        this.layoutHelperService.currentLanguage.subscribe(res=>{
                this.navLanguageSwitcher(res);
                this.getUserGroupByUserId();
        })
    }

    scrollToTop(){
        this.scroll.scrollToPosition([0,0]);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void {
        const navigation = this._fuseNavigationService.getComponent(name);
        if (navigation) {
            navigation.toggle();
        }
    }

    setLanguage(lang): void {
        this.selectedLanguage = lang;
        this._translateService.use(lang);

        this.navLanguageSwitcher(this.selectedLanguage);
        this.layoutHelperService.setLanguageEvent(this.selectedLanguage);
    }

    private navLanguageSwitcher(selectedLanguage: string): void {
        if (selectedLanguage === 'en') {
            this.navigation = lngEnglish.data.NAV;
        } else if (selectedLanguage === 'bn') {
            this.navigation = lngBangla.data.NAV;
        }
    }

    getUserGroupByUserId() {
        this.userGroupService.getUserGroupByUserId().subscribe(res => {console.log(res);
            if (res) {
                let language;
                this.layoutHelperService.currentLanguage.subscribe(ln=>{
                    language = ln;
                });
                if (res.agency) {
                    if(language == 'en'){
                        this.userGroupName = res.agency.nameEn;
                        this.ministryName = res.agency.ministryDivision.nameEn;
                        this.userGroupDesc = res.agency.description;
                    } else {
                        this.userGroupName = res.agency.nameBn;
                        this.ministryName = res.agency.ministryDivision.nameBn;
                        this.userGroupDesc = res.agency.description;
                    }
                } else if (res.ministryDivision) {
                    if (language=='en')
                        this.userGroupName = res.ministryDivision.nameEn;
                    else
                        this.userGroupName = res.ministryDivision.nameBn;
                } else if (res.planningMinister) {
                    if (language=='en')
                        this.userGroupName = res.planningMinister.nameEn;
                    else
                        this.userGroupName = res.planningMinister.nameBn;
                } else if (res.sectorDivision) {
                    if (language=='en')
                        this.userGroupName = res.sectorDivision.sectorDivisionNameEn;
                    else
                        this.userGroupName = res.sectorDivision.sectorDivisionNameBn;
                }
            }
        });
    }

    loadStateData(): any {
        this.userProfileService.currentData.subscribe(res => {
            this.userName = res.name;
            if (res.profileImageUrl) {
                this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
            } else {
                this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
            }
        }, err => {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        });
    }

    getUserProfileInfo(): any {
        this.userProfileService.getUserProfileInfo().subscribe(res => {
            console.log(res);
            this.setUserProfileInfo(res);
        }, err => {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        });
    }

    setUserProfileInfo(res): any {
        this.userName = res.name;
        this.email = res.email;
        this.designation = res.designation;
        if (res.profileImageUrl) {
            this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
        } else {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        }
    }
}
