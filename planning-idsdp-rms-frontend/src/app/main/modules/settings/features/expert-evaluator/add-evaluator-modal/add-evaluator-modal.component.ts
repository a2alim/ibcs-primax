import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FuseAlertType} from "../../../../../../../@fuse/components/alert";
import {ERROR, OK} from "../../../../../core/constants/message";
import {UserListServiceService} from "../../../services/user-list-service.service";

@Component({
  selector: 'app-add-evaluator-modal',
  templateUrl: './add-evaluator-modal.component.html',
  styleUrls: ['./add-evaluator-modal.component.scss']
})
export class AddEvaluatorModalComponent implements OnInit {
    closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
      private _formBuilder: FormBuilder,
      private snackBar: MatSnackBar,
      private userService:UserListServiceService

  ) { }

    alert: { type: FuseAlertType, message: string } = {
        type: 'success',
        message: ''
    };


    @ViewChild('signInNgForm') signInNgForm: NgForm;
    signInForm: FormGroup;
    showAlert: boolean = false;
    agreements: any = true;

  ngOnInit(): void {
      this.signInForm = this._formBuilder.group({
          isInstitutional: false,
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          mobileNumber: ['', Validators.required],
          // gender: ['', Validators.required],
          gender: [''],
          password: ['', Validators.required],
          agreements: ['',false],
          confirmPassword: ['', Validators.required],
          rememberMe: ['']
      });
  }

    confirm(value: boolean): void {
        this.closeEventEmitter.emit(value);

    }

    createUser(f: NgForm): void {

        if (!f.valid) {
            return;
        }

        if(this.signInForm.value.agreements==="" || this.signInForm.value.agreements===null){
            this.signInForm.value.agreements=false;
        }

        const isInstitutional = false;
        const name = this.signInForm.value.name;
        const email = this.signInForm.value.email;
        const mobile = this.signInForm.value.mobileNumber;
        const gender = this.signInForm.value.gender;
        const password = this.signInForm.value.password;
        const agreements = this.signInForm.value.agreements;
        const designation = this.signInForm.value.designation;
        const confirmPassword = this.signInForm.value.confirmPassword;
        const rememberMe = this.signInForm.value.rememberMe;

        console.log("ag",agreements)
        if (agreements ===false) {
            this.openErrorSnackBarWithMessage('Please Confirm Agreement', ERROR);
            return;
        }

        if (password != confirmPassword) {
            this.openErrorSnackBarWithMessage('Those passwords didn’t match. Try again.', ERROR);
            return;
        }



        if (name && email && mobile && password) {

            console.log(name, email, mobile, password, isInstitutional)
            this.signInForm.disable();
            this.userService.createNewUser(name, email, mobile, password, isInstitutional).subscribe(
                res => {
                    if (res) {
                        this.openSuccessSnackBarWithMessage('Evaluator Credentials Add Success!',OK);
                        this.closeEventEmitter.emit(true);
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


    isAgreement(val) {
        console.log('val == ', val);
        this.agreements = val;
        this.signInForm.value.agreements=val;
        if (this.agreements) {
            console.log('agreements1 == ', this.agreements);
        } else {
            console.log('agreements2 = ', this.agreements);
        }
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
}
