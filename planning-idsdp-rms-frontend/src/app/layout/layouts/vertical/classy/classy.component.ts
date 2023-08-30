import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService } from '@fuse/components/navigation';
import { InitialData } from 'app/app.types';
import { TranslateService } from '@ngx-translate/core';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';

import { BaseUrlConstant } from '../../../../main/core/constants/base.url.constant';
import { UserProfileService } from '../../../common/service/user.profile.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { SsoService } from 'app/layout/common/service/sso.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'app/main/core/services/api/api.service';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {

    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;
    minioEndPointHost: string = environment.ibcs.minioEndPointHost;
    showModal = false;
    showModalButton = false;
    @ViewChild('inputForm') inputForm: NgForm;
    frmGroup: FormGroup;
    spinner: boolean = false;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    data: InitialData;
    languages: any;
    isScreenSmall: boolean;
    selectedLanguage: any;
    userName: any;
    email: any;
    profileImageUrl: any;
    signatureImageUrl: any;
    imageUrlEndPoint = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT + '/';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation;
    logoImageUrl: any = '/assets/images/logo/bd.png';
    profileImageUrl2: any = '/assets/images/avatars/user_profile_icon.png';
    rmsUserProfileData: any = {}

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _translateService: TranslateService,
        private cookieService: CookieService,
        private userProfileService: UserProfileService,
        private storage: StorageService,
        private dataCom: DataComService,
        private formBuilder: FormBuilder,
        private globalVal: GlobalValidationServiceService,
        private _ssoService: SsoService,
        private toastr: ToastrService,
        private apiService: ApiService,
        private http: HttpClient
    ) {
        this.selectedLanguage = 'en';

        const headers = new HttpHeaders().set('token', this.cookieService.get('access_token'));
        const params = new HttpParams().append('service_name', 'SSRC');


        /*this._http.get(environment.ibcs.baseApiEndPoint + 'gateway/nav', {headers, params}).subscribe(res => {

               // lngEnglish.data.NAV = [];
               // lngEnglish.data.NAV.push(res);
               // this.navLanguageSwitcher(this.selectedLanguage);
            },
            (error) => {
                //Error callback
                console.error('error caught in component');
                if (error.status == 500) {
                  //  alert('Your token may have expired. Please Sign In again');
                }

                //throw error;   //You can also throw the error to a global error handler
            });*/

        // Nav Initial Language
        this.navLanguageSwitcher(this.selectedLanguage);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    userInfo1: any = {};
    ngOnInit(): void {
        this.loadStateData();
        this.getUserProfileInfo();
        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        let userInfo = this.storage.getUserData();
        this.userInfo1 = userInfo;
        this.userName = (userInfo.userType && userInfo.userType == 'Rms_Training_Institute') ? userInfo.organigationName : userInfo.name;

        if (userInfo.userType == 'Rms_DO') {
            this.showModalButton = true;
        }

        this.frmGroup = this.formBuilder.group({
            userId: ['', [this.globalVal.trimValidator('User ID')]],
            password: ['', [this.globalVal.trimValidator('Password')]],
        });

        if (this.userInfo1 && ((this.userInfo1.userType == 'Rms_Evaluator') || (this.userInfo1.userType == 'Rms_Researcher') || (this.userInfo1.userType == 'Rms_DO'))) {
            this.getUserProfileUuid(userInfo.id).subscribe(
                response => {
                    this.rmsUserProfileData = response ? response : {};
                },
                error => {
                    this.rmsUserProfileData = {};
                }
            );
        }

        if (this.userInfo1 && (this.userInfo1.userType == 'Rms_Training_Institute')) {
            this.getProfileViewById(userInfo.id).subscribe(
                response => {
                    this.rmsUserProfileData = response ? response : {};                   
                },
                error => {
                    this.rmsUserProfileData = {};
                }
            );
        }

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle(name);
        }
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set Current Lang for next time get current lang
        if (localStorage.getItem("currentLang") !== null) {
            localStorage.removeItem("currentLang")
        }
        localStorage.setItem("currentLang", lang)
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang);

        // Nav Language Change
        this.navLanguageSwitcher(this.selectedLanguage);

        this.dataCom.setPassedItemData({ "lang": lang });
    }

    private navLanguageSwitcher(selectedLanguage: string): void {

        if (selectedLanguage === 'en') {
            this.navigation = lngEnglish.data.NAV;
        } else {
            this.navigation = lngBangla.data.NAV;
        }

    }


    loadStateData(): any {
        this.userProfileService.currentData.subscribe(res => {
            //this.userName = res.name;
            this.userName = (res?.userType && res?.userType == 'Rms_Training_Institute') ? res?.organigationName : res?.name;

            if (res?.profileImageUrl) {
                this.profileImageUrl = this.imageUrlEndPoint + res?.profileImageUrl;
            } else {
                this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
            }
        }, err => {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        });
    }

    getUserProfileInfo(): any {
        this.userProfileService.getUserProfileInfo().subscribe(res => {
            this.setUserProfileInfo(res);
        }, err => {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        });
    }

    setUserProfileInfo(res): any {
        this.userName = (res.userType && res.userType == 'Rms_Training_Institute') ? res.organigationName : res.name;
        this.email = res.email;
        if (res.profileImageUrl) {
            this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
        } else {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        }
    }


    /*----------------------Submit SSO Login Form-------------------------*/

    submitForm(): void {
        this.spinner = true
        this._ssoService.signInWithDoptor(this.frmGroup.value.userId, this.frmGroup.value.password).subscribe(res => {
            this.cookieService.set('doptor_token', res.access_token, null, '/');
            localStorage.setItem("doptor_token", res.access_token);
            this.toggleModal();
            this.spinner = false;
            this.toastr.success('Login success', "", this.config);

            //this.checkNothiUserIsExist(res.user.employee_record_id, this.signInSsoForm.value.password);
        },
            error => {
                if (error.error.message === 'User Not Found') {
                    this.spinner = false;
                    this.toastr.error('User not found', "", this.config);
                }
                else if (error.error.message === '') {
                    this.spinner = false;
                    this.toastr.error('Invalid username or password', "", this.config);
                }
                else {
                    this.spinner = false;
                    this.toastr.error('Unexpected error occurred in communicating with ek-sheba', "", this.config);
                }
            });
    }

    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        } else {
            this.spinner = false;
            this.toastr.error('Fill up all required field', "", this.config);
        }
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }


    submitFormX() {
        // this.spinner=true;
        // if (this.formTitle == 'Edit') {
        //   this.fiscalYearService.updateData(this.frmGroup.value).subscribe(
        //     res => {
        //       if (res.success) {
        //         this.spinner=false;
        //         this.toastr.success(res.message, "Success!", this.config);
        //         this.formReset();
        //         this.getListData();
        //       } else {
        //         this.spinner=false;
        //         this.toastr.error(res.message, "Error!", this.config);
        //       }
        //     },
        //     err => {
        //       this.toastr.error('Http Error Occord !.', "Error!", this.config);
        //     }
        //   )
        // }
        // else {
        //   this.fiscalYearService.saveData(this.frmGroup.value).subscribe(
        //     res => {
        //       if (res.success) {
        //         this.spinner=false;
        //         this.toastr.success(res.message, "Success!", this.config);
        //         this.formReset();
        //         this.getListData();
        //       } else {
        //         this.spinner=false;
        //         this.toastr.error(res.message, "Error!", this.config);
        //       }
        //     },
        //     err => {
        //       this.toastr.error('Http Error Occord !.', "Error!", this.config);
        //     }
        //   )
        // }
    }
    /*----------------------/Submit SSO Login Form-------------------------*/


    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    getUserProfileUuid(userId: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/by-userId/' + userId;
        return this.apiService.get(url);
    }


    baseTiEndPoint = environment.ibcs.tiBackend;
    getProfileViewById(id: any) {
        return this.http.get(this.baseTiEndPoint + "training-institute-profile/" + id);

    }

}
