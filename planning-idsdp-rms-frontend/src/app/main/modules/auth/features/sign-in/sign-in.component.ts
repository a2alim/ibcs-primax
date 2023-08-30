import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private cookieService: CookieService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.login(this.signInForm.value.email,this.signInForm.value.password)
            .subscribe(
                (data) => {

                    // this.cookieService.set('access_token',data.access_token,null,'/','localhost');
                    // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // console.log(redirectURL);
                    // this._router.navigateByUrl(redirectURL);
                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    //this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    //this.showAlert = true;
                    this.openSnackBar('User not found, Please try again', 'Ok')
                }
            );
    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }
}
