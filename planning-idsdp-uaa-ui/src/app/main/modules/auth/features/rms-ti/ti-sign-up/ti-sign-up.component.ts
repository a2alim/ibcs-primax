import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {FuseAlertType} from '../../../../../../../@fuse/components/alert';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {SsoService} from '../../../services/sso.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CookieService} from 'ngx-cookie-service';
import {SsoVerifyService} from '../../../../sso/services/sso-verify.service';
import {UaaService} from '../../../services/uaa.service';
import {UserService} from '../../../../../core/user/user.service';
import {OK} from '../../../../../core/constants/message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../shared/constant/confirm.dialog.constant';
import {OtpComponent} from '../../otp/otp.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-ti-sign-up',
    templateUrl: './ti-sign-up.component.html',
    styleUrls: ['./ti-sign-up.component.scss']
})
export class TiSignUpComponent implements OnInit {
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
    agreements: any = false;
    termsAndCondition ="";
    btnDisabled: boolean = false;

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
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private cookieService: CookieService,
        private ssoVerifyService: SsoVerifyService,
        private uaaService: UaaService,
        private userService: UserService
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
            trainingInstituteName: ['', Validators.required],
            headOfInstitute: ['', [Validators.required]],
            designation: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
            //dateOfBirth: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            userType: ['Rms_Training_Institute'],
            rememberMe: [true],
            agreements: ['', Validators.required],
        });
    }

    otpValidation(userId: any): void {
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
                                this._router.navigate(['rms/training-institution/sign-in']);
                                dialogRef.close(true);
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
            duration: 7000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    // tslint:disable-next-line:typedef
    isAgreement(val) {
        this.agreements = val;
        this.termsAndCondition = (val) ? 'true' : 'false';
    }

    createUser(f: any): void {
        const email = this.signInForm.value.email;
        if (!f.valid) {
            this.termsAndCondition = 'false';
            return;
        }
        if (this.signInForm.value.password !== this.signInForm.value.confirmPassword) {
            this.openErrorSnackBarWithMessage('Password not match', '');
            return;
        }

        let mailTo = this.signInForm?.value?.email || '';
        console.log("mailTo = ", mailTo);
        this.signInForm.disable()
        
        this.userService.createRmsTINewUser(this.signInForm.value).subscribe(
            res => {                          
                if (res) {
                    if (environment.enableOtp){
                        this.otpValidation(res.id);
                    }
                }                
                f.reset();
                this.signInNgForm.resetForm();
                this.openToasterDialogBox('Account activation link sent to ' + mailTo, '');
                this.signInForm.enable();   
            }, err => {
                this.openErrorSnackBarWithMessage(err.error.errorMessage, '');
                this.signInForm.enable();
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

    showSignInSdppForm(): void {
        this.ssoForm = false;
    }

}
