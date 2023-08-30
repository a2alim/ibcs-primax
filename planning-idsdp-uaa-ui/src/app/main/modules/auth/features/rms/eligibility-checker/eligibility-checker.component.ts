import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR, OK } from 'app/main/core/constants/message';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { ProfileMarksSetup } from '../../model/ProfileMarksSetup';
import { EligibilityChecker } from '../../model/eligibilityChecker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ShowMarkModalComponent } from './show-mark-modal/show-mark-modal.component';
import { ShowMarks } from '../../model/show-marks';
// import { locale as lngEnglish } from "./i18n/en";
// import { locale as lngBangla } from "./i18n/bn";

@Component({
  selector: 'app-eligibility-checker',
  templateUrl: './eligibility-checker.component.html',
  styleUrls: ['./eligibility-checker.component.scss']
})
export class EligibilityCheckerComponent implements OnInit {

  signInForm: FormGroup;
  showAlert: false;

  profileMarksSetup: ProfileMarksSetup = new ProfileMarksSetup();
  eligibilityChecker: EligibilityChecker = new EligibilityChecker();
  showMarks: ShowMarks = new ShowMarks();

  config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

  maxDate = new Date();


  graduateDivisionList = [
    { propertyName: 'firstDivision', labelName: '1st Division' },
    { propertyName: 'secDivision', labelName: '2nd Division' },
    { propertyName: 'thirdDivision', labelName: '3rd Division' }
  ];

  postGraduateDivisionList = [
    { propertyName: 'postGraduateResultMarksFirst', labelName: '1st Division' },
    { propertyName: 'postGraduateResultMarksSec', labelName: '2nd Division' },
    { propertyName: 'postGraduateResultMarksThird', labelName: '3rd Division' }
  ];

  researchExperienceList = [
    { propertyName: 'researchExperienceOneToSeven', labelName: '1' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '2' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '3' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '4' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '5' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '6' },
    { propertyName: 'researchExperienceOneToSeven', labelName: '7' },

    { propertyName: 'researchExperienceEight', labelName: '8' },

    { propertyName: 'researchExperienceEightPlus', labelName: '8+' },
  ]

  journalPublicationLoc = [
    { propertyName: 'journalPublicationLocOneToFive', labelName: '1' },
    { propertyName: 'journalPublicationLocOneToFive', labelName: '2' },
    { propertyName: 'journalPublicationLocOneToFive', labelName: '3' },
    { propertyName: 'journalPublicationLocOneToFive', labelName: '4' },
    { propertyName: 'journalPublicationLocOneToFive', labelName: '5' },


    { propertyName: 'journalPublicationLocSixToTen', labelName: '6' },
    { propertyName: 'journalPublicationLocSixToTen', labelName: '7' },
    { propertyName: 'journalPublicationLocSixToTen', labelName: '8' },
    { propertyName: 'journalPublicationLocSixToTen', labelName: '9' },
    { propertyName: 'journalPublicationLocSixToTen', labelName: '10' },

    { propertyName: 'journalPublicationLocTenPlus', labelName: '10+' },
  ]

  journalPublicationInt = [
    { propertyName: 'journalPublicationIntOneToFive', labelName: '1' },
    { propertyName: 'journalPublicationIntOneToFive', labelName: '2' },
    { propertyName: 'journalPublicationIntOneToFive', labelName: '3' },
    { propertyName: 'journalPublicationIntOneToFive', labelName: '4' },
    { propertyName: 'journalPublicationIntOneToFive', labelName: '5' },


    { propertyName: 'journalPublicationIntSixToTen', labelName: '6' },
    { propertyName: 'journalPublicationIntSixToTen', labelName: '7' },
    { propertyName: 'journalPublicationIntSixToTen', labelName: '8' },
    { propertyName: 'journalPublicationIntSixToTen', labelName: '9' },
    { propertyName: 'journalPublicationIntSixToTen', labelName: '10' },

    { propertyName: 'journalPublicationIntTenPlus', labelName: '10+' },
  ];

  spinner: boolean;
  researchCategoryList: any[] = [];

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
    private _httpClient: HttpClient,
    private _dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
  ) {
    // this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
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

      personName: ['', Validators.required],
      stResearchCatTypeId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],

      graduationResultSelectPoint: ['1', Validators.required],
      graduateResult: ['', Validators.required],
      isGovEmployee: ['true', Validators.required],

      postGraduationReSelectPoint: ['1', Validators.required],
      postGraduateResult: ['', Validators.required],
      isThesisGroup: ['true', Validators.required],

      isResearchTraining: ['true', Validators.required],
      researchExperience: ['',],

      doYouHave: ['',],

      journalPublicationLocQty: ['',],
      journalPublicationIntQty: ['',],

    });

    this.getResearchCategoryList();

  }


  submitForm() {
    //this.openMarkDialog(this.showMarks);
    console.log('form value ==== >>>>> ', this.signInForm.value);
    console.log('For valiod Or In Valied === >>>> ', this.signInForm.valid);

    if (!this.signInForm.valid) {
      this.openErrorSnackBarWithMessage('Fillup required field!.', ERROR);
      return;
    }

    const graduationResultSelectPoint = this.signInForm.value.graduationResultSelectPoint;
    const postGraduationReSelectPoint = this.signInForm.value.postGraduationReSelectPoint;
    const AGE = this.calculateDiff(this.signInForm.value.dateOfBirth);

    const graduateResultMark = (graduationResultSelectPoint == '1') ? this.profileMarksSetup[this.signInForm.value.graduateResult] : this.calculationCGPAmark(this.signInForm.value.graduateResult);
    const isGovEmployeeMark = this.signInForm.value.isGovEmployee == 'true' ? this.profileMarksSetup.govEmployee : 0;
    const postGraduateResultMark = (postGraduationReSelectPoint == '1') ? this.profileMarksSetup[this.signInForm.value.postGraduateResult] : this.calculationCGPAmarkForPostGraduation(this.signInForm.value.postGraduateResult);
    const isThesisGroupMark = this.signInForm.value.isThesisGroup == 'true' ? this.profileMarksSetup.thesisGroup : this.profileMarksSetup.nonThesis;
    const researchExperienceMark = this.profileMarksSetup[this.signInForm.value.researchExperience.propertyName] ? this.profileMarksSetup[this.signInForm.value.researchExperience.propertyName] : 0;
    const journalPublicationLocQtyMark = this.profileMarksSetup[this.signInForm.value.journalPublicationLocQty.propertyName] ? this.profileMarksSetup[this.signInForm.value.journalPublicationLocQty.propertyName] : 0;
    const journalPublicationIntQtyMark = this.profileMarksSetup[this.signInForm.value.journalPublicationIntQty.propertyName] ? this.profileMarksSetup[this.signInForm.value.journalPublicationIntQty.propertyName] : 0;
    const mPhilMark = [...this.signInForm.value.doYouHave].includes('MPhil') ? this.profileMarksSetup.mphil : 0;
    const PHDMark = [...this.signInForm.value.doYouHave].includes('PhD') ? this.profileMarksSetup.phd : 0;
    const ageMark = this.signInForm.value.isGovEmployee == 'true' ? this.profileMarksSetup.applicantAge : (AGE < 40) ? this.profileMarksSetup.applicantAge : 0;





    console.log('graduateResultMark === >>>> ', graduateResultMark);
    console.log('isGovEmployeeMark === >>>> ', isGovEmployeeMark);
    console.log('postGraduateResultMark === >>>> ', postGraduateResultMark);
    console.log('isThesisGroupMark === >>>> ', isThesisGroupMark);
    console.log('researchExperienceMark === >>>> ', researchExperienceMark);
    console.log('journalPublicationLocQtyMark === >>> ', journalPublicationLocQtyMark);
    console.log('journalPublicationIntQtyMark === >>> ', journalPublicationIntQtyMark);
    console.log('AGE ==== >>>> ', AGE);
    console.log('ageMark ==== >>>> ', ageMark);
    console.log('mPhilMark ==== >>>> ', mPhilMark);
    console.log('PHDMark ==== >>>> ', PHDMark);


    this.eligibilityChecker = { ...this.signInForm.value };
    this.eligibilityChecker.journalPublicationLocQty = this.signInForm.value.journalPublicationLocQty.labelName;
    this.eligibilityChecker.journalPublicationIntQty = this.signInForm.value.journalPublicationIntQty.labelName;
    this.eligibilityChecker.totalResearchExperience = this.signInForm.value.researchExperience.labelName;
    this.eligibilityChecker.isMPhil = [...this.signInForm.value.doYouHave].includes('MPhil') ? true : false;
    this.eligibilityChecker.isPhD = [...this.signInForm.value.doYouHave].includes('PhD') ? true : false;


    console.log('eligibilityChecker === >>>> ', this.eligibilityChecker);
    const URL = `${environment.ibcs.rpmBackend}api/eligibility-checker/create-eligibility-checker`;

    this.spinner = true;
    this._httpClient.post<any>(URL, this.eligibilityChecker).pipe(map((data: any) => data)).subscribe(
      response => {
        if (response.success) {
          console.log('response obj ===== >>>> ', response.obj);
          this.spinner = false;

          this.showMarks = { ...response.obj };
          this.showMarks.graduateResultMark = graduateResultMark;
          this.showMarks.isGovEmployeeMark = isGovEmployeeMark;
          this.showMarks.postGraduateResultMark = postGraduateResultMark;
          this.showMarks.isThesisGroupMark = isThesisGroupMark;
          this.showMarks.researchExperienceMark = researchExperienceMark;
          this.showMarks.journalPublicationLocQtyMark = journalPublicationLocQtyMark;
          this.showMarks.journalPublicationIntQtyMark = journalPublicationIntQtyMark;
          this.showMarks.mPhilMark = mPhilMark;
          this.showMarks.PHDMark = PHDMark;
          this.showMarks.ageMark = ageMark;
          this.showMarks.age = AGE;


          localStorage.removeItem('showMarks');
          localStorage.setItem('showMarks', JSON.stringify(this.showMarks));
          const showMarks = JSON.parse(localStorage.getItem('showMarks'));


          this.openMarkDialog(showMarks);
          this.openSuccessSnackBarWithMessage(response.message, 'OK');
          this.signInForm.reset();


        } else {
          this.spinner = false;
          this.openErrorSnackBarWithMessage(response.message, ERROR);
        }
      },
      error => {
        console.log('error ==== >>>> ', error);
        this.spinner = false;
        this.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
      }
    );
  }

  back() {
    this._router.navigate(['rms/researcher/sign-up']);
  }


  getResearchCategoryList() {
    this.spinner = true;
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/research-category-type/get-active-list`;
    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        console.log('response ==== >>>> ', response);
        this.researchCategoryList = response.items ? response.items : [];
        this.spinner = false;
      }, error => {
        console.log('error ==== >>>> ', error);
        this.spinner = false;
      }
    );
  }


  onChangeResearchCategorye(event: any) {
    console.log('category id ==== >>>> ', event.value);
    this.getProfileMarksSetupDataByResearchCategoryId(event.value);
  }

  getProfileMarksSetupDataByResearchCategoryId(categoryId: any) {
    const URL = `${environment.ibcs.rmsConfigurationBackend}api/profile-marks-setup/find-by-St-research-cat-type-id/${categoryId}`;

    this._httpClient.get<any>(URL).pipe(map((data: any) => data)).subscribe(
      response => {
        if (response.success) {
          console.log(' profileMarksSetup response ===== >>>> ', response.obj);
          this.profileMarksSetup = new ProfileMarksSetup();
          this.profileMarksSetup = response.obj ? response.obj : new ProfileMarksSetup();
          this.spinner = false;
        } else {
          this.spinner = false;
          this.profileMarksSetup = new ProfileMarksSetup();
        }
      }, error => {
        console.log('error ==== >>>> ', error);
        this.spinner = false;
        this.profileMarksSetup = new ProfileMarksSetup();
        this.openErrorSnackBarWithMessage('HTTP error occured!.', ERROR);
      }
    );
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


  calculationCGPAmark(gCGPA: number): number {

    let marks = 0;
    if (gCGPA > 0 && gCGPA < 3.5) {
      marks = this.profileMarksSetup['graduateCgpsBelow35'];
    }
    else if (gCGPA > 0 && gCGPA >= 3.5 && gCGPA <= 3.9) {
      marks = this.profileMarksSetup['graduateCgps35To39'];
    }
    else if (gCGPA > 0 && gCGPA === 4) {
      marks = this.profileMarksSetup['graduateCgps4'];
    }
    else {
      marks = 0;
    }
    return marks;
  }

  calculationCGPAmarkForPostGraduation(gCGPA: number): number {

    let marks = 0;
    if (gCGPA > 0 && gCGPA < 3.5) {
      marks = this.profileMarksSetup['postGraduateCgpsBelow35'];
    }
    else if (gCGPA > 0 && gCGPA >= 3.5 && gCGPA <= 3.9) {
      marks = this.profileMarksSetup['postGraduateCgps35To39'];
    }
    else if (gCGPA > 0 && gCGPA === 4) {
      marks = this.profileMarksSetup['postGraduateCgps4'];
    }
    else {
      marks = 0;
    }
    return marks;
  }


  calculateDiff(sentOn): number {

    let todayDate = new Date();
    let sentOnDate = new Date(sentOn);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    let defferenceYear = Math.floor((differenceInTime / (1000 * 3600 * 24)) / 365);
    return defferenceYear;

  }

  onChangeTotalResesrchExp(event: any) {

  }

  onChangeLocalPublicationNo(event: any) {

  }

  onChangeIntPublicationNo(event: any) {
    console.log('event === >>>> ', event);
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }


  openMarkDialog(showMarks: ShowMarks) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '50%';
    dialogConfig.height = 'auto';
    dialogConfig.data = { ...showMarks };

    const dialogRef = this._dialog.open(ShowMarkModalComponent, dialogConfig);
    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
      if (res) {
        dialogRef.close(true);
      }
    });
  }


  showEligibilityMark() {
    const showMarks = JSON.parse(localStorage.getItem('showMarks'));

    // if (!showMarks) {
    //   this.openSuccessSnackBarWithMessage('Your eligibility information is blank. If you want to verify your eligibility for research, submit your information first.', OK);
    //   return;
    // }
    this.openMarkDialog(showMarks);
  }



}