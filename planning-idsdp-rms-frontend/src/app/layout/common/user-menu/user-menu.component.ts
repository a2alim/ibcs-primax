import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../main/core/user/user.model';
import { UserService } from '../../../main/core/user/user.service';
import { environment } from 'environments/environment';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import { relativeTimeThreshold } from 'moment';
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'userMenu'
})
export class UserMenuComponent implements OnInit, OnDestroy {
    static ngAcceptInputType_showAvatar: BooleanInput;

    @Input() showAvatar: boolean = true;
    user: User;
    userName: any;
    email: any;
    profileImageUrl: any;
    signatureImageUrl: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private cookieService: CookieService,
        private storage: StorageService,
        private _authService: AuthService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.loadStateData();
        // this.getUserProfileInfo();
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        let userInfo = this.storage.getUserData();
        //console.log('userInfo', userInfo.name);

        if (this.user == null) {
            this.user = {
                id: null,
                name: userInfo.name,
                email: userInfo.email,
                status: 'online'
            };
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
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    goToProfilePage(): any {

        let userInfo = this.storage.getUserData();
        var url = '';

        if (userInfo.userType != "" && (userInfo.userType == 'Rms_Researcher')) {
            url = 'researcher-profile-information';
        }
        if (userInfo.userType != "" && (userInfo.userType == 'Rms_Evaluator')) {
            url = 'training';
        }
        if (userInfo.userType != "" && (userInfo.userType == 'Rms_Training_Institute')) {
            url = 'ti-profile-information';
        }

        this._router.navigate([url]);
    }

    /**
     * Sign out
     */
     signOut() {

        let userInfo = this.storage.getUserData();
        var url = '';

        // if (userInfo.userType != "" && (userInfo.userType == 'Rms_Researcher')) {
        //     url = 'sign-out/rms/researcher';
        // }
        // else if (userInfo.userType != "" && (userInfo.userType == 'Rms_Evaluator')) {
        //     url = 'training';
        // }
        // else if (userInfo.userType != "" && (userInfo.userType == 'Rms_Training_Institute')) {
        //     url = 'evaluator';
        // }
        // else {
        //     url = 'sign-out';
        // }

        if(userInfo.userType != "" && ((userInfo.userType == 'Rms_Researcher') || (userInfo.userType == 'Rms_Evaluator') || (userInfo.userType == 'Rms_Training_Institute')))
        {
            url = 'sign-out/rms/researcher';
        }
        else {
            url = 'sign-out';
        }
        this._authService.signOut();
        location.href = environment.ibcs.mainDomainName+'/'+ url;

    }

    // loadStateData(): any {
    //     this.userProfileService.currentData.subscribe(res => {
    //         this.userName = res.name;
    //         if (res.signatureImageUrl) {
    //             this.signatureImageUrl = res.signatureImageUrl;
    //         } else {
    //             this.signatureImageUrl = '/assets/images/avatars/signature.png';
    //         }
    //         if (res.profileImageUrl) {
    //             this.profileImageUrl = res.profileImageUrl;
    //         } else {
    //             this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
    //         }
    //     }, err => {
    //         this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
    //         this.signatureImageUrl = '/assets/images/avatars/signature.png';
    //     });
    // }
    // getUserProfileInfo(): any {
    //     this.userProfileService.getUserProfileInfo().subscribe(res => {
    //         console.log(res);
    //         this.setUserProfileInfo(res);
    //     }, err => {
    //         this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
    //     });
    // }
    setUserProfileInfo(res): any {
        this.userName = res.name;
        this.email = res.email;
        if (res.profileImageUrl) {
            this.profileImageUrl = res.profileImageUrl;
        } else {
            this.profileImageUrl = '/assets/images/logo/bd.png';
        }
    }

    onClickChangePass() {
        this._router.navigate(['change-password']);
    }


}
