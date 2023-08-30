import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthUtils} from 'app/main/core/auth/auth.utils';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../../../../environments/environment';
import {UserProfileService} from '../../../../shared/service/user-profile.service';
import {BaseUrlConstant} from '../../../../core/constants/base.url.constant';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PpsConfigurationService} from '../../../../shared/service/pps-configuration.service';

export interface Contract {
    Id: string;
    Name: string;
}

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class NavigationComponent implements OnInit {

    appAccess = [];
    ppsUrl: string = environment.ibcs.ppsUrl + 'dashboard';
    rmsFrontendApp: string = environment.ibcs.rmsFrontendApp + 'rms-dashboard';
    npmFrontendApp: string = environment.ibcs.npmFrontendApp + '/drf-dashboard';
    commonServiceUrl: string = environment.ibcs.commonServiceUrl;
    gisFrontendApp: string = environment.ibcs.gisFrontendApp;
    imageUrlEndPoint = environment.ibcs.baseApiEndPoint + BaseUrlConstant.PRIVATE_API_ENDPOINT;

    userName: any;
    email: any;
    designation: string;
    profileImageUrl: any;

    agency: any;
    ministry_Division: any;
    sessionId: any = '';

    constructor(private cookieService: CookieService,
                private userProfileService: UserProfileService,
                private ppsConfigurationService: PpsConfigurationService,
                private router: Router,
                private _snackBar: MatSnackBar) {
    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    ngOnInit(): void {
        this.sessionId = sessionStorage.getItem('sessionId');
        const decodedToken = AuthUtils._decodeToken(sessionStorage.getItem('access_token').toString());
        if (decodedToken.appAccess) {
            this.appAccess = decodedToken.appAccess;
            this.getUserProfileInfo();
            this.setAgencyInfo();
        }
    }

    getUserProfileInfo(): any {
        this.userProfileService.getUserProfileInfo().subscribe(res => {
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

    setAgencyInfo(): any {
        this.ppsConfigurationService.getUserGroupByUserId().subscribe(configRes => {
            if (configRes) {
                if (configRes.agency) {
                    this.agency = configRes.agency.nameEn;
                    this.ministry_Division = configRes.agency.ministryDivision.nameEn;
                } else if (configRes.ministryDivision) {
                    this.ministry_Division = configRes.ministryDivision.nameEn;
                } else if (configRes.planningMinister) {
                    this.ministry_Division = configRes.planningMinister.nameEn;
                } else if (configRes.sectorDivision) {
                    this.ministry_Division = configRes.sectorDivision.sectorDivisionNameEn;
                }
            }
        });
    }

    // tslint:disable-next-line:typedef
    sendAccessTokens() {
        this.apiCall(res => {
            if (res) {
                const token = sessionStorage.getItem('access_token');
                window.open(this.gisFrontendApp + '?access_token=' + token, '_self');
            } else {
                this.openSnackBar('Something went wrong while communicating with GIS server', 'Ok');
            }
        });
    }

    apiCall(callback){
        const accessToken = sessionStorage.getItem('access_token');
        const doptorToken = sessionStorage.getItem('doptor_token');

        const payload = {
            'access_token': accessToken,
            'doptor_token': doptorToken,
            'user_name': this.userName,
            'designation': this.designation,
            'profile_image': this.profileImageUrl,
            'agency': this.agency,
            'ministry_division': this.ministry_Division,
        };
        this.userProfileService.setTokenInGis(payload).subscribe(res => {
            if (res.status === 0){
               callback(true);
           } else {
               callback(false);
           }
        });
    }
}
