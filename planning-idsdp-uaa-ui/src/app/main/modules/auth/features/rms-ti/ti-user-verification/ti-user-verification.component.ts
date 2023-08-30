import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../../../core/user/user.service';
import {OK} from '../../../../../core/constants/message';

@Component({
    selector: 'app-user-verification',
    templateUrl: './ti-user-verification.component.html',
    styleUrls: ['./ti-user-verification.component.scss']
})
export class TiUserVerificationComponent implements OnInit {
    userId: any;
    data: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private router: Router,
    ) {
    }

    openSuccessSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }


    ngOnInit(): void {
        this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
        this.signUpVerification();
    }


    // tslint:disable-next-line:typedef
    signUpVerification() {
        this.userService.UserVerification(this.userId).subscribe(res => {

                this.openSuccessSnackBarWithMessage(res, OK);
            },
            error => {
            this.data = error.error.text;
            this.openSuccessSnackBarWithMessage(error.error.text, OK);
            });


    }


    signInPage() {
        //this.router.navigate(['/rms/training-institution/sign-in']);
        this.router.navigate(['/rms/researcher/sign-in']);
    }
}
