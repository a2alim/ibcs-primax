import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { HelpModel } from '../../../model/help-model.model';
import { HelpServiceService } from '../../../services/help-service.service';

@Component({
    selector: 'app-help-line',
    templateUrl: './help-line.component.html',
    styleUrls: ['./help-line.component.scss'],
})
export class HelpLineComponent implements OnInit {

    moduleList: HelpModel[] = [];
    spinner: boolean;

    form!: FormGroup;
    submitted = false;
    constructor(private formBuilder: FormBuilder,
        private helpService: HelpServiceService,
        public snackBar: MatSnackBar,
        private snackbarHelper: SnackbarHelper,

        ) {}

    ngOnInit(): void {
        this.populateForm();
    }

    populateForm() {
        this.form = this.formBuilder.group({
            uuid: new FormControl(''),
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            // email: ['', [Validators.required, Validators.email]],
            email: ['', [Validators.required, Validators.email,
                 Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            message: ['', Validators.required],
            additionalDetails: ''
         });
    }

    sendMessage() {
        this.submitted = true;
        if(this.form.valid) {
         this.create();
         this.submitted = false;
        }
    }

    create() {
        this.spinner = true;
        this.helpService.create(this.form.value).subscribe(res => {
            console.log('Succ',res)
            if (res) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Message sent succussfully !', 'OK');
                this.reset();
                this.spinner = false;
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage('Message Not Sent succussfully !', 'OK');
                this.spinner = false;
            }
        })
    }

    reset() {
        this.form.reset();
        this.form.patchValue({
            status: true
        })
    }

}
