import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { AuthUtils } from '../../../../../core/auth/auth.utils';
import { SsoVerifyService } from '../../../../sso/services/sso-verify.service';
import { AuthService } from '../../../services/auth.service';
import { SsoService } from '../../../services/sso.service';
import { UaaService } from '../../../services/uaa.service';
@Component({
    selector: 'app-rms-login',
    templateUrl: './rms-login.component.html',
    styleUrls: ['./rms-login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: FuseAnimations
})
export class RmsLoginComponent implements OnInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    countdown: number = 5;

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
    rmsFrontendApp: string = environment.ibcs.rmsFrontendApp;

    loginFormTitle = '';
    routeName:any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _ssoService: SsoService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private cookieService: CookieService,
        private ssoVerifyService: SsoVerifyService,
        private uaaService: UaaService,
        private _httpClient: HttpClient,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        localStorage.removeItem('sessionId');
        localStorage.removeItem('access_token');

        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('access_token');
        

        this._authService.signOut();
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required]],
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

        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        this.showAlert = false;
        // Disable the form
        // Hide the alert

        this.check(res => {
            if (!res) {
               // console.log('call back response === >>>> ', res);
                this.signInForm.disable();

                this._authService.login(this.signInForm.value.email, this.signInForm.value.password)
                    .subscribe(
                        (data) => {
                            this.signInForm.enable();
                            sessionStorage.setItem('access_token', data.access_token);
                            /*------------Create SessionID-------------*/
                            let sessionId = uuid();
                            this._authService.createSession(sessionId, data.access_token, '').subscribe((res) => {
                                sessionStorage.setItem('sessionId', res.sessionId);
                            })
                            /*------------/Create SessionID-------------*/

                            if (data.userType === 'Rms_Evaluator') {
                                window.location.href = this.rmsFrontendApp + 'evaluator-profile?p=' + sessionId;
                            }
                            if (data.userType === 'Rms_Training_Institute') {
                                window.location.href = this.rmsFrontendApp + 'profile/739bc694-b2dd-43b5-ab2c-925aac9075bf$' + data.id + '?p=' + sessionId;
                            } 
                            if(data.userType === 'Rms_Researcher') {
                                window.location.href = this.rmsFrontendApp + 'researcher/profile?p=' + sessionId;
                            }
                        },
                        (response) => {

                            // Re-enable the form
                            this.signInForm.enable();

                            // Reset the form
                            // this.signInNgForm.resetForm();

                            // Set the alert
                            this.alert = {
                                type: 'error',
                                message: 'Wrong email or password'
                            };

                            // Show the alert
                            // this.showAlert = true;
                            //this.openSnackBar('User not found, Please try again', 'Ok');
                            this.openSnackBar('Invalid Email or Password.', 'Ok');
                        }
                    );
            }
        })
        // Sign in

    }

    check(callBack) {

        const URL = `${environment.ibcs.baseApiEndPoint}api/users/find-by-email/${this.signInForm.value.email}`;
        this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
            response => {
                if (response === 'Your email address is not verified. Please verify your email address.') {
                    this.alert = {
                        type: 'error',
                        message: 'Your email address is not verified. Please verify your email address.'
                    };
                    callBack(true);
                }
                else if (response === 'Your Mobile Number is not verified. Please verify your Mobile Number.') {
                    this.alert = {
                        type: 'error',
                        message: 'Your Mobile Number is not verified. Please verify your Mobile Number.'
                    };
                    callBack(true);
                }
                else {
                    callBack(false);
                }
            }, error => {
                if (error.error.text === 'Your email address is not verified. Please verify your email address first.') {
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: 'Your email address is not verified. Please verify your email address first.'
                    };
                    callBack(true);
                }
               else if (error.error.text === 'Your Mobile Number is not verified. Please verify your Mobile Number first.') {
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: 'Your Mobile Number is not verified. Please verify your Mobile Number first.'
                    };
                    callBack(true);
                }

                else {
                    callBack(false);
                }

            });
    }

    signInSso(): void {
        this._ssoService.signInWithDoptor(this.signInSsoForm.value.userId, this.signInSsoForm.value.password).subscribe(res => {
            //this.cookieService.set('access_token', res.access_token, null, '/');
            sessionStorage.setItem('access_token', res.access_token);
            this.checkNothiUserIsExist(res.user.employee_record_id, this.signInSsoForm.value.password);
        },
            error => {
                if (error.error.message === 'User Not Found') {
                    this.openSnackBar('User Not Found', 'OK');
                } else {
                    this.openSnackBar('Unexpected error occurred in communicating with ek-sheba', 'OK');
                }
            });
    }

    checkNothiUserIsExist(employee_record_id, password): void {
        //const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
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
                        this._router.navigate(['navigation']);
                    }
                });
            } else {
                this.openSnackBar('Your account is needed activation from SDPP', 'OK');
            }
        });
    }

    researchSignUp() {
        this._router.navigate(['rms/researcher/sign-up']);
    }

    trainingInstituteSignUp(){
        this._router.navigate(['rms/training-institute/sign-up']);
    }

    showSignInSsoForm(): void {
        this.ssoForm = true;
    }

    showSignInSdppForm(): void {
        this.ssoForm = false;
    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

}
