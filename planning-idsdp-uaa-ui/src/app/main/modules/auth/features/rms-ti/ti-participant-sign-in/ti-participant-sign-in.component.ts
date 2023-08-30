import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {FuseAlertType} from '../../../../../../../@fuse/components/alert';
import {environment} from '../../../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {SsoService} from '../../../services/sso.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CookieService} from 'ngx-cookie-service';
import {ParticipantLoginService} from '../services/participant-login.service';
import {FiscalYearService} from '../services/fiscal-year.service';
import {DEFAULT_TOKEN} from '../constant/dufault-token.constant';

@Component({
    selector: 'app-ti-participant-sign-in',
    templateUrl: './ti-participant-sign-in.component.html',
    styleUrls: ['./ti-participant-sign-in.component.scss']
})
export class TiParticipantSignInComponent implements OnInit {

    @ViewChild('signInNgForm') signInNgForm: NgForm;

    @ViewChild('signInSsoNgForm') signInSsoNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type: 'success',
        message: ''
    };

    fiscalYearList: any[] = [];
    signInForm: FormGroup;
    isShowLoginPanel: boolean = false;
    isShowOTPPanel: boolean = true;
    loginForm: FormGroup;
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
        private _fiscalYearService: FiscalYearService,
        private _snackBar: MatSnackBar,
        private cookieService: CookieService,
        private participantLoginService: ParticipantLoginService
    ) {
        this.cookieService.set('access_token', DEFAULT_TOKEN, null, '/');
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
            email: ['', [Validators.required]]
        });

        // Create OTP the form
        this.loginForm = this._formBuilder.group({
            otpCode: ['', [Validators.required]]
        });
        this.getFiscalYearList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        if (this.loginForm.valid) {
            console.log(this.loginForm.value.otpCode);
            const body = {
                otpCode: this.loginForm.value.otpCode
            };
            this.participantLoginService.login(body).subscribe(response => {

                this.cookieService.set('participantId', response.participantId, null, '/');
                window.location.href = this.rmsFrontendApp + 'speaker-evaluation';
                this.openSnackBar('Login Successfully!', 'OK');
            }, error => {
                this.openSnackBar('Invalid OTP!', 'OK');
            });
        }
    }

    getFiscalYearList(): void {
        this._fiscalYearService.getAllActiveFiscalYear().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
            }
        );
    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    sendOTPCode(): void {
        console.log(this.fiscalYearList);
        if (this.signInForm.valid) {
            const body = {
                mobileNumberOrEmail: "0"+this.signInForm.value.email,
                fiscalYearId: this.fiscalYearList[0].id
            };

            this.participantLoginService.sendOTPCode(body).subscribe(response => {
                if (response.statusCode === 404)
                {
                    this.openSnackBar('You are not valid participant !', 'OK');
                }else{
                    this.isShowLoginPanel = true;
                    this.isShowOTPPanel = false;
                    this.openSnackBar('OTP sent successful !', 'OK');
                }


            }, error => {
                this.openSnackBar('OTP not sent!', 'OK');
            });
        }
    }
}
