import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {FuseNavigationService} from '@fuse/components/navigation';
import {InitialData} from 'app/app.types';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {UserProfileService} from '../../../../main/shared/service/user-profile.service';
import {environment} from '../../../../../environments/environment';
import {BaseUrlConstant} from '../../../../main/core/constants/base.url.constant';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    imageUrlEndPoint = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT;
    data: InitialData;
    languages: any;
    isScreenSmall: boolean;
    selectedLanguage: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation;
    userName: any;
    email: any;
    profileImageUrl: any;
    signatureImageUrl: any;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _translateService: TranslateService,
        private userProfileService: UserProfileService
    ) {
        this.selectedLanguage = 'en';

        // Nav Initial Language
        this.navLanguageSwitcher(this.selectedLanguage);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loadStateData();
        this.getUserProfileInfo();
        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {

        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang);

        // Nav Language Change
        this.navLanguageSwitcher(this.selectedLanguage);
    }

    private navLanguageSwitcher(selectedLanguage: string): void {
        console.log(selectedLanguage);
        if (selectedLanguage === 'en') {
            this.navigation = lngEnglish.data.NAV;
        } else {
            this.navigation = lngBangla.data.NAV;
        }

    }

    loadStateData(): any {
        this.userProfileService.currentData.subscribe(res => {
            this.userName = res.name;
            if (res.signatureImageUrl) {
                this.signatureImageUrl = this.imageUrlEndPoint + res.signatureImageUrl;
            } else {
                this.signatureImageUrl = '/assets/images/avatars/signature.png';
            }
            if (res.profileImageUrl) {
                this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
            } else {
                this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
            }
        }, err => {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
            this.signatureImageUrl = '/assets/images/avatars/signature.png';
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
        if (res.profileImageUrl) {
            this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
        } else {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        }
    }
}
