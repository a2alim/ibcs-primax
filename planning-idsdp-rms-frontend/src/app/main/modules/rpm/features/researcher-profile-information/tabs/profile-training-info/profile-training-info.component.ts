import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import { ResearchExprienceFormModel } from "../../../../models/ResearchExprienceFormModel";
import { ProfileTrainingFormModel } from "../../../../models/ProfileTrainingFormModel";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { RmsProfileNotApplicable } from 'app/main/modules/rpm/models/notApplicable/RmsProfileNotApplicable';
import { Location } from '@angular/common';

@Component({
    selector: 'app-profile-training-info',
    templateUrl: './profile-training-info.component.html',
    styleUrls: ['./profile-training-info.component.scss']
})
export class ProfileTrainingInfoComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    profileTrainingFormModelList: ProfileTrainingFormModel[] = new Array();
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    spinner: boolean;
    spinner1: boolean;

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    id: number;
    trainingYearList = new Array<{
        year: any;
    }>();

    rmsProfileNotApplicable = new RmsProfileNotApplicable();
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    trainingsLength = 0;
    isApplicable: number = 2;

    @Input() set tNotApplicable(value: any) {
        if(value !== undefined && value !== NaN && value != 0  && value <= 2){
            this.isApplicable = (this.trainingsLength>0) ? 2 : value;
        }
    }

    uuid: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private matDialog: MatDialog,
        private _location: Location
        ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.addNewForm();
    }

    ngOnInit(): void {
        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.id = +(this._activatedRoute.snapshot.paramMap.get('uid'));

        if (this.uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(this.uuid);
        } else {
            this.isUpdatedAction = false;
        }
        this.generateYear();
    }

    getDataByUuid(uuid: string) {
        if (!this.uuid && localStorage.getItem("profilePersonalInfoUuid") == null) {
            // setTimeout(() => { this.addNewForm() }, 100);
            return;
        }

        let finalUuid = uuid ? uuid : localStorage.getItem("profilePersonalInfoUuid");
        this.spinner = true;
        this._researchProfileMultiFormService.profileView(finalUuid).subscribe(data => {
            this.profileTrainingFormModelList = (data.trainings && data.trainings.length > 0) ? data.trainings : [];
            if (data.trainings.length > 0) {
            } else {
                setTimeout(() => { this.addNewForm(); }, 100);
            }
            this.spinner = false;
            this.trainingsLength = data.trainings.length
            //this.isApplicable = (this.profileTrainingFormModelList.length > 0) ? 2 : 1;
        }, error => {
            console.log('Successfully not saved');
            this.spinner = false;
        })
    }

    save(isApplicable) {

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

       if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if(isApplicable == 1){
            return this.saveOrUpdateNotApplication(0);
        }

        if (!this.isUpdatedAction) {
            this.spinner1 = true;
            this._researchProfileMultiFormService.saveData(this.profileTrainingFormModelList, null, 'ProfileTraining').subscribe(data => {
                if (data.success) {
                    this._toastrService.success(data.message, "", this.config);
                } else {
                    this._toastrService.error(data.message, "", this.config);
                }
                this.spinner1 = false;
            }, error => {
                this._toastrService.error("Save unsuccessful", "", this.config);
                this.spinner1 = false;
            });
        } else {
            this.spinner1 = true;
            this._researchProfileMultiFormService.updateDataByTabName(this.id, this.profileTrainingFormModelList, null, 'ProfileTraining').subscribe(data => {
                if (data.success) {
                    this._toastrService.success(data.message, "", this.config);
                } else {
                    console.log('Successfully not saved')
                    this._toastrService.error("Save unsuccessful", "", this.config);
                }
                this.spinner1 = false;
            }, _ => {
                console.log('Successfully not saved')
                this._toastrService.error("Save unsuccessful", "", this.config);
                this.spinner1 = false;
            });
        }
    }

    /*
    * Bottom Default Tab Options
    * */
    nextTab() {
        this.nextStep.emit(true);
    }

    saveAndNext(isApplicable = 0) {

        let profilePersonalInfoId = localStorage.getItem("profilePersonalInfoId");

        if (profilePersonalInfoId != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
        }

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if(isApplicable == 1){
            return this.saveOrUpdateNotApplication(1);
        }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }
        this.onSave();
        this.nextTab();
    }

    saveOrUpdateNotApplication(next){
        let uId = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        this._researchProfileMultiFormService.saveOrUpdateNotApplicable(uId).subscribe(res => {
            if (res.success) {
                this.rmsProfileNotApplicable = res.obj;
                sessionStorage.setItem('pId', res?.obj.id);
                this._toastrService.success('Saved successfully!', "", this.config);
                if(next == 1){
                    this.nextTab();
                }
            }
        }, error => {
            this._toastrService.error("Save unsuccessful", "", this.config);
            console.log(error)
        })
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    addNewForm() {
        this.profileTrainingFormModelList.push(
            {
                id: null,
                uuid: null,
                profilePersonalInfoId: null,
                trainingName: '',
                instituteOrCenterName: '',
                duration: '',
                result: '',
                isEditable: false,
                isDeleted: 0,
                trainingTopic: ''
            }
        )
    }


    generateYear() {
        const fullYear = (new Date()).getFullYear();
        for (let i = 1950; i <= fullYear; i++) {
            this.trainingYearList.push({ year: i.toString() });
        }
    }

    deleteFormByIndex(index: number) {
        if (this.profileTrainingFormModelList[index].uuid) {
            // this.profileTrainingFormModelList[index].isDeleted = 1;
            this.openDialog(index);
        } else {
            this.profileTrainingFormModelList.splice(index, 1);
        }

        // setTimeout(() => {
        //     let f = this.profileTrainingFormModelList.filter(f => f.isDeleted != 1);
        //     if (f.length == 0) {
        //         this.addNewForm();
        //     }
        // }, 100);

    }

    radioChange(val) {
        sessionStorage.setItem('trainingInfo', val);
        var retrievedObject = sessionStorage.getItem('trainingInfo');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));

        let rasult = this.profileTrainingFormModelList.some(s => s.id != null);
        if (rasult) {
            this._toastrService.error("First delete the Training information");
            setTimeout(() => { this.isApplicable = 2; }, 100 / 99);
            return;
        }
    }


    onSave(isApplicable = 0) {

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.id = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        if (!this.id) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.id = +pathSegments[4];
        }

        if (!this.id) {
            this._toastrService.error('Personal information save first');
            return;
        }

        if(isApplicable == 1){
            return this.saveOrUpdateNotApplication(0);
        }

        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        this.profileTrainingFormModelList = this.profileTrainingFormModelList.map(m => {
            m.profilePersonalInfoId = this.id;
            m.isDeleted = m.isDeleted ? 1 : 0;
            return m;
        });

        this.spinner = true;

        this._researchProfileMultiFormService.saveDataNew(this.profileTrainingFormModelList, null, 'ProfileTraining').subscribe(
            (data) => {
                if (data.success) {
                    this._toastrService.success(data.message);
                    this.spinner = false;
                    this.getDataByUuid(this.uuid);
                } else {
                    this.spinner = false;
                    this._toastrService.error(data.message);
                }
            },
            (error) => {
                this.spinner = false;
                this._toastrService.error('Save unsuccessful');
            }
        );


    }


    checkRequirdField(): Boolean {
        let isValied = true;
        this.profileTrainingFormModelList.forEach(f => {
            if (!(f.instituteOrCenterName || f.trainingName) || !f.duration || !f.trainingTopic) {
                return isValied = false;
            }
        });
        return isValied;
    }


    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.profileTrainingFormModelList[i].isDeleted = 1
                this.onSave();
            }
            dialogRef.close(true);
        });
    }
}
