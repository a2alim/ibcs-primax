import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SsoService } from '../../../services/sso.service';
import { AuthUtils } from '../../../../../core/auth/auth.utils';
import { SsoVerifyService } from '../../../../sso/services/sso-verify.service';
import { UaaService } from '../../../services/uaa.service';
import { UserService } from 'app/main/core/user/user.service';
import { ERROR, OK } from 'app/main/core/constants/message';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from '../../../../../shared/constant/confirm.dialog.constant';
import { OtpComponent } from '../../otp/otp.component';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ShowMarkModalComponent } from '../eligibility-checker/show-mark-modal/show-mark-modal.component';
import { ShowDetailsModalComponent } from './show-details-modal/show-details-modal.component';

@Component({
    selector: 'app-rms-sign-up',
    templateUrl: './rms-sign-up.component.html',
    styleUrls: ['./rms-sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: FuseAnimations
})
export class RmsSignUpComponent implements OnInit {

    @ViewChild('signInNgForm') signInNgForm: NgForm;
    @ViewChild('signInSsoNgForm') signInSsoNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type: 'success',
        message: ''
    };

    spinner: boolean;
    signInForm: FormGroup;
    signInSsoForm: FormGroup;
    showAlert: boolean = false;
    ssoForm: boolean = true;
    agreements: any = false;
    isInstitutional = 2;
    researchGuideLineList: any[] = [];

    termsAndCondition ="";

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
        private uaaService: UaaService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private _httpClient: HttpClient,
        private _dialog: MatDialog,
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
            isInstitutional: [2, Validators.required],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mobileNumber: ['', Validators.required],
            // gender: ['', Validators.required],
            gender: [''],
            password: ['', Validators.required],
            agreements: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            rememberMe: ['']
        });
        this.getResearchGuideLineList();
    }

    isAgreement(val) {
        this.agreements = val;
        this.termsAndCondition = (val) ? 'true' : 'false';
        //console.log('this.termsAndCondition = ', this.termsAndCondition);
    }

    createUser(f: NgForm): void {       
        if (!f.valid) {
            this.termsAndCondition = "false";
            return;
        }

        let isInstitutional = (this.signInForm.value.isInstitutional === 1) ? true : false;
        const name = this.signInForm.value.name;
        const email = this.signInForm.value.email;
        const mobile = this.signInForm.value.mobileNumber;
        const gender = this.signInForm.value.gender;
        const password = this.signInForm.value.password;
        const agreements = this.signInForm.value.agreements;
        const designation = this.signInForm.value.designation;
        const confirmPassword = this.signInForm.value.confirmPassword;
        const rememberMe = this.signInForm.value.rememberMe;
        //console.log('this.signInForm = ', this.signInForm.value);
        //return;

        if (password != confirmPassword) {
            this.openErrorSnackBarWithMessage('Those passwords didn’t match. Try again.', ERROR);
            return;
        }

        if (name && email && mobile && password && agreements) {
            this.signInForm.disable();
            this.userService.createNewUser(name, email, mobile, password, isInstitutional).subscribe(
                res => {
                    if (res) {
                        this.openToasterDialogBox('Account activation link sent to ' + email, OK);
                        if (environment.enableOtp){
                            this.otpValidation(res.id);
                        }

                    }
                    this.signInForm.enable();
                    f.reset();
                    this.signInNgForm.resetForm();

                }, error => {
                    this.openErrorSnackBarWithMessage(error.error.errorMessage, ERROR);
                    this.signInForm.enable();
                });
        }
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

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.login(this.signInForm.value.email, this.signInForm.value.password)
            .subscribe(
                (data) => {
                    this.cookieService.set('access_token', data.access_token, null, '/');
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    //console.log(redirectURL);
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                    // this._router.navigate(['navigation']);
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
            this.cookieService.set('access_token', res.access_token, null, '/');
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


    openErrorSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }

    openWarnSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['warn-snackbar']
        });
    }


    openSuccessSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    openToasterDialogBox(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 25000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    eligibilityChecker() {
        this._router.navigate(['rms/eligibility-checker/add']);
    }

    onChangeIsInstitutional(event) {
        this.isInstitutional = event == 1 ? 2 : 1;
    }


    // tslint:disable-next-line:typedef
    otpValidation(userId: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.OTP };
        const dialogRef = this.dialog.open(OtpComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {

            if (res[0].rs) {
                // tslint:disable-next-line:radix
                this.userService.otpResend(parseInt(userId)).subscribe(ores => {
                    if (ores.status) {
                        this.openSuccessSnackBarWithMessage(ores.message, OK);
                    } else {
                        this.openErrorSnackBarWithMessage(ores.message, OK);
                    }
                });
            } else {
                if (res[0].status) {
                    const otpData = res[0].car1 + '' + res[0].car2 + '' + res[0].car3 + '' + res[0].car4;
                    const data: any = {
                        // tslint:disable-next-line:radix
                        'otp': parseInt(otpData),
                        // tslint:disable-next-line:radix
                        'userId': parseInt(userId)
                    };

                    this.userService.otpVerification(data).subscribe(otpRes => {
                        if (otpRes.status) {
                            this.openSuccessSnackBarWithMessage(otpRes.message, OK);
                            if (otpRes.status) {
                                dialogRef.close(true);
                                this.signInPage();
                            }
                        } else {
                            this.openErrorSnackBarWithMessage(otpRes.message, OK);
                        }
                    });
                }

                if ((res[0].cl)) {
                    dialogRef.close(true);
                }
            }
        });


    }


    signInPage() {
        this._router.navigate(['/rms/researcher/sign-in']);

    }

    getResearchGuideLineList() {
        const URL = `${environment.ibcs.rmsConfigurationBackend}api/research-guide-line/get-list`;
        this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
            response => {
                if (response.success) {
                    this.researchGuideLineList = response.items;
                    this.spinner = false;
                } else {
                    this.spinner = false;
                }
            }, error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
                this.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
            }
        );
    }


    showDetails(getVal: any,lang) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = 'auto';
        dialogConfig.data = { ...getVal, lang};

        const dialogRef = this._dialog.open(ShowDetailsModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
          if (res) {
            dialogRef.close(true);
          }
        });
    }
}
