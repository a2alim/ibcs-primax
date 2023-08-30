import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {BooleanInput} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../../main/core/user/user.model';
import {UserService} from '../../../main/core/user/user.service';
import {environment} from 'environments/environment';
import {UserProfileService} from "../../../main/modules/auth/services/user.profile.service";


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
    imageUrlEndPoint = environment.ibcs.authServerBackendEndpoint;
    viewProfileUrl = environment.ibcs.commonServiceUrl + 'access-control/view-profile';

   // viewProfileUrl = "http://localhost:4300/access-control/view-profile";

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private userProfileService: UserProfileService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadStateData();
        this.getUserProfileInfo();
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        if (this.user == null) {
            this.user = {
                id: null,
                name: null,
                email: '',
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

    goToProfilePage() {
        this._router.navigate(['access-control/view-profile']);
    }

    /**
     * Sign out
     */
    signOut(): void {
        location.href = environment.ibcs.authUiUrl + 'sign-out';
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
        if (res.profileImageUrl) {
            this.profileImageUrl = this.imageUrlEndPoint + res.profileImageUrl;
        } else {
            this.profileImageUrl = '/assets/images/avatars/user_profile_icon.png';
        }
    }
}
