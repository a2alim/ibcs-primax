import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { environment } from 'environments/environment';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ChangePasswordService } from '../service/change-password.service';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  /*----Button Icon Text---*/
  saveIcon = saveIcon;
  refreshIcon = refreshIcon;
  /*----/Button Icon Text---*/

  spinner: boolean = false;
  fieldTextType1: boolean = false;
  fieldTextType2: boolean = false;
  fieldTextType3: boolean = false;

  user: any = {};

  @ViewChild('changePassForm') changePassForm: NgForm;
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private fuseTranslationLoaderService: FuseTranslationLoaderService,
    private activateRoute: ActivatedRoute,
    private storage: StorageService,
    private changePasswordService: ChangePasswordService,
  ) {
    // Language translations
    this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.user = this.storage.getUserData();
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [this.user.id],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  checkMatch(event) {
    let newPass = this.formGroup.get('newPassword').value;
    let confirmNewPass = this.formGroup.get('confirmNewPassword').value;

    if (newPass !== confirmNewPass) {
      this.formGroup.controls['confirmNewPassword'].setErrors({ doesNotMatch: true });
    } else {
      this.formGroup.controls['confirmNewPassword'].setErrors(null);
    }
  }

  submitForm() {

    if (this.formGroup.invalid) {
      this.toastr.warning('Please Fill Required Field !');
      return;
    }

    this.spinner = true;

    this.changePasswordService.changePass(this.formGroup.value).subscribe(
      res => {
        if (res.status == 200) {
          this.toastr.success(res.message);
          this.signOut();
        }
        this.spinner = false;
      },
      res => {
        if (res.status == 200) {
          this.toastr.success(res.error.text);
          setTimeout(() => {
            this.signOut();
          }, 3000);
        } else {
          this.toastr.warning(res.error.message ? res.error.message : res.error);
          console.log('reset pass err', res);
        }
        this.spinner = false;
      }
    )
  }

  resetFormValue() {
    this.formGroup.reset();
    this.changePassForm.resetForm();
    setTimeout(() => {
      this.formGroup.patchValue({
        id: this.user.id,
      });
    }, 500);
  }

  signOut(): void {
    let userInfo = this.user;
    var url = '';

    if (userInfo.userType != "" && (userInfo.userType == 'Rms_Researcher')) {
      url = 'sign-out/rms/researcher';
    }
    else if (userInfo.userType != "" && (userInfo.userType == 'Rms_Evaluator')) {
      url = 'training';
    }
    else if (userInfo.userType != "" && (userInfo.userType == 'Rms_Training_Institute')) {
      url = 'evaluator';
    }
    else {
      url = 'sign-out';
    }
      this.cookieService.delete('access_token','/');
    // For planing server. http://sso.plandiv.gov.bd/
    location.href = environment.ibcs.mainDomainName + url;

    // For localhost and IBCS-Server
    //location.href = environment.ibcs.authServerUri + url;
  }


}
