import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {FuseAlertType} from "../../../../../../../@fuse/components/alert";
import {environment} from "../../../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {SsoService} from "../../../services/sso.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";
import {SsoVerifyService} from "../../../../sso/services/sso-verify.service";
import {UaaService} from "../../../services/uaa.service";
import {AuthUtils} from "../../../../../core/auth/auth.utils";

@Component({
  selector: 'app-ti-sign-in',
  templateUrl: './ti-sign-in.component.html',
  styleUrls: ['./ti-sign-in.component.scss']
})
export class TiSignInComponent implements OnInit {

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
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', Validators.required],
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

        console.log('this.signInForm ==== >>>> ', this.signInForm);

        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.login(this.signInForm.value.email, this.signInForm.value.password)
            .subscribe(
                (data) => {

                    //this.cookieService.set('access_token', data.access_token, null, '/');
                    sessionStorage.setItem('access_token', data.access_token);

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // console.log(redirectURL);
                    // Navigate to the redirect url
                    //  this._router.navigateByUrl(this.rmsFrontendApp);
                    window.location.href = this.rmsFrontendApp;
                    // this._router.navigate([this.rmsFrontendApp]);

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

    tiSignUp(): void {
        this._router.navigate(['rms/training-institution/sign-up']);
    }
}
