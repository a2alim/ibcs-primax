import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {FuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from '../../services/auth.service';


@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    successMessage = 'Password reset url has been sent successfully. Please check your e-mail address. Within 10 Minutes!';

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder
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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    console.log(response);

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: this.successMessage,
                    };
                },
                (response) => {
                    if (response.status === 404){
                        // Set the alert
                        this.alert = {
                            type   : 'error',
                            message: 'Email does not found!'
                        };
                    }
                    // Set the alert
                    // this.alert = {
                    //     type   : 'error',
                    //     message: 'Email does not found! Are you sure you are already a member?'
                    // };
                    if (response.status === 200){
                    this.alert = {
                        type   : 'success',
                        message: this.successMessage,
                    };
                    }
                }
            );
    }
}
