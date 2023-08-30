import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {FuseAnimations} from '@fuse/animations';
import {FuseValidators} from '@fuse/validators';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: FuseAnimations
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    userId: any;
    validity: any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userId = this.activatedRoute.snapshot.paramMap.get('id');
        this.validity = this.activatedRoute.snapshot.paramMap.get('validity');
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        const data = {
            userId: this.userId,
            validity: this.validity
        };
        // Send the request to the server
        this._authService.resetPassword(this.resetPasswordForm.get('password').value, data)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    console.log(response);

   // Set the alert
                    this.alert = {
                            type: 'success',
                            message: 'Your password has been reset successfully!'
                        };



                },
                (response) => {
                    console.log(response);
                    if (response.status === 403) {

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: response.error
                        };
                    } else if (response.status === 200) {
                        this.alert = {
                            type: 'success',
                            message: 'Your password has been reset successfully!'
                        };
                    }
                    else if (response.status === 404) {
                        this.alert = {
                            type: 'error',
                            message: response.error
                        };

                    } else {
                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: 'Something went wrong, please try again.'
                        };
                    }


                }
            );
    }
}
