import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SsoService } from '../../services/sso.service';
import { AuthUtils } from '../../../../core/auth/auth.utils';
import { SsoVerifyService } from '../../../sso/services/sso-verify.service';
import { UaaService } from '../../services/uaa.service';
import { v4 as uuid } from 'uuid';
import { environment } from 'environments/environment';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: FuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    @ViewChild('signInSsoNgForm') signInSsoNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    signInSsoForm: FormGroup;
    showAlert: boolean = false;
    ssoForm: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _ssoService: SsoService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private cookieService: CookieService,
        private ssoVerifyService: SsoVerifyService,
        private uaaService: UaaService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit() {

        await this._authService.signOut();

        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
        // Create the sso form
        this.signInSsoForm = this._formBuilder.group({
            userId: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }

        this.signInForm.disable();
        this.showAlert = false;

        this._authService.login(this.signInForm.value.email, this.signInForm.value.password)
            .subscribe(
                (data) => {
                    // this.cookieService.set('access_token', data.access_token, null, '/');
                    sessionStorage.setItem('access_token', data.access_token);
                    /*------------Create SessionID-------------*/
                    const sessionId = uuid();
                    // this.cookieService.set('sessionId', sessionId, null, '/');
                    sessionStorage.setItem('sessionId', sessionId);
                    this._authService.createSession(sessionId, data.access_token, '').subscribe(async (res) => {});

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.

                    const userType = this._authService.getLoggedUserType();
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // tslint:disable-next-line:triple-equals
                    if (userType != ''){
                        // tslint:disable-next-line:triple-equals
                        if (userType == 'Rms_Researcher'){
                            window.location.href = environment.ibcs.rmsFrontendApp + 'researcher/profile?p=' + sessionId;
                        }
                        else if (data.userType === 'Rms_Evaluator') {
                            window.location.href = environment.ibcs.rmsFrontendApp + 'evaluator-profile?p=' + sessionId;
                        }
                        else if (data.userType === 'Rms_Training_Institute') {
                            window.location.href = environment.ibcs.rmsFrontendApp + 'profile/739bc694-b2dd-43b5-ab2c-925aac9075bf$' + data.id + '?p=' + sessionId;
                        }
                        else {
                            this._router.navigateByUrl(redirectURL);
                        }
                    }
                    else
                    {
                        this._router.navigateByUrl(redirectURL);
                    }
                },
                (response) => {
                    this.signInForm.enable();
                    // this.signInNgForm.resetForm();
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    this.openSnackBar('Invalid Email or Password.', 'Ok');
                }
            );
    }

    signInSso(): void {
        this.signInForm.disable();
        this._ssoService.signInWithDoptor(this.signInSsoForm.value.userId, this.signInSsoForm.value.password).subscribe(res => {
            // this.cookieService.set('access_token', res.access_token, null, '/');
            sessionStorage.setItem('access_token', res.access_token);
            this.checkNothiUserIsExist(res.user.employee_record_id, this.signInSsoForm.value.password);
        },
        error => {
            this.signInForm.enable();
            if (error.error.message === 'User Not Found') {
                this.openSnackBar('User Not Found', 'OK');
            }
            else if (error.error.message === '') {
                this.openSnackBar('Invalid username or password', 'OK');
            }
            else {
                this.openSnackBar('Unexpected error occurred in communicating with ek-sheba', 'OK');
            }
        });
    }

    checkNothiUserIsExist(employee_record_id, password): void {
        // const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
        const decodedToken = AuthUtils._decodeToken(sessionStorage.getItem('access_token').toString());
        const username = decodedToken.user_id;
        this.uaaService.getUserByUserIdAndUserType(employee_record_id, password).subscribe(r => {
            if (r.status === 302) {
                this.ssoVerifyService.ssoUserVerify(employee_record_id, password).subscribe(res => {
                    if (res.status === 201 || res.status === 202) {
                        this.openSnackBar('Something went wrong', 'OK');
                    } else if (res.status === 200) {
                        // const doptor_token = this.cookieService.get('access_token');
                        // this.cookieService.set('doptor_token', doptor_token, null, '/');
                        // this.cookieService.set('access_token', res.body.access_token, null, '/');
                        // this._router.navigate(['navigation']);

                        const doptor_token = sessionStorage.getItem('access_token');
                        sessionStorage.setItem('doptor_token', doptor_token);
                        sessionStorage.setItem('access_token', res.body.access_token);

                        /*------------Create SessionID-------------*/
                        const sessionId = uuid();
                        const doptorToken = sessionStorage.getItem('doptor_token');
                        // this.cookieService.set('sessionId', sessionId, null, '/');
                        sessionStorage.setItem('sessionId', sessionId);
                        this._authService.createSession(sessionId, res.body.access_token, doptorToken).subscribe(async (res) => {});
                        /*------------/Create SessionID-------------*/

                        this._router.navigate(['navigation']);
                    }
                });
            } else {
                this.signInForm.enable();
                this.openSnackBar('Your account is needed activation from SDPP', 'OK');
            }
        });
    }

    showSignInSsoForm(): void {
        this.ssoForm = true;
    }

    showSignInSdppForm(): void {
        this.ssoForm = false;
    }

    focusoutFunc() {

        if (this.signInSsoForm.value.userId.length == 5) {
            let txt = this.signInSsoForm.value.userId.slice(0, 1) + "0000000" + this.signInSsoForm.value.userId.slice(1, 5);
            this.signInSsoForm.value.userId = txt;
            this.signInSsoForm.patchValue({ "userId": txt });
        }
        else if (this.signInSsoForm.value.userId.length == 4) {
            let txt = (this.signInSsoForm.value.userId.slice(0, 1)) + "00000000" + this.signInSsoForm.value.userId.slice(1, 4);
            this.signInSsoForm.patchValue({ "userId": txt });
        }
        else {

        }
    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    goToImsPage(urlStr){
        this._router.navigate(['ims/'+urlStr]);
    }

}
