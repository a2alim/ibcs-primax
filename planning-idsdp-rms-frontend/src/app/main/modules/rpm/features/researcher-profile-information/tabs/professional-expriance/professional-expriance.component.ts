import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import { ProfassionalExprienceFormModel } from "../../../../models/ProfassionalExprienceFormModel";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { DateAdapter } from '@angular/material/core';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { empty } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { RmsProfileNotApplicable } from 'app/main/modules/rpm/models/notApplicable/RmsProfileNotApplicable';
import {Location} from "@angular/common";

@Component({
    selector: 'app-professional-expriance',
    templateUrl: './professional-expriance.component.html',
    styleUrls: ['./professional-expriance.component.scss']
})
export class ProfessionalExprianceComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    professionalExperienceList: ProfassionalExprienceFormModel[] = new Array();
    rmsProfileNotApplicable = new RmsProfileNotApplicable()

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    uuid: string;
    uid: number;
    isToDateDisable = false;
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    nextIcon = nextIcon;
    addNewIcon = addNewIcon;
    /*----/Button---*/

    minEditorConfig: any = MIN_EDITOR_CONFIG;

    professionalExpLength = 0;
    isApplicable: number = 2;

    @Input() set proNotApplicable(value: any) {
        if(value !== undefined && value !== NaN && value != 0  && value <= 2){
            this.isApplicable = (this.professionalExpLength>0) ? 2 : value;
        }
    }


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private matDialog: MatDialog,
                private _location: Location
                ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {
        this.uuid = this._activatedRoute.snapshot.paramMap.get('id');
        this.uid = +(this._activatedRoute.snapshot.paramMap.get('uid'));
        if (this.uuid != null) {
            this.isUpdatedAction = true;
            this.getDataByUuid(this.uuid)
        } else {
            this.isUpdatedAction = false;
        }
    }

    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(
            data => {
                this.professionalExperienceList = (data.professionalExperiences && data.professionalExperiences.length > 0) ? data.professionalExperiences : [];
                if (!this.professionalExperienceList || this.professionalExperienceList.length < 1) {
                    this.addNewForm();
                }
                this.professionalExperienceList = this.professionalExperienceList.map(m => {
                    if (m.isContinue) {
                        m.isToDateDisable = true;
                    }
                    return m;
                });
                this.professionalExpLength = data.professionalExperiences.length;
                this.isApplicable = (this.professionalExperienceList.length > 0) ? 2 : 1;
            }, error => {
                console.log('Successfully not saved');
            });
    }

    checkRequirdField(): Boolean {
        let isValied = true;
        this.professionalExperienceList.forEach(f => {
            if (f.fromDate === null
                || !f.responsibilityDetail

            ) {
                isValied = false;
            }
        });
        return isValied;
    }


    save(forAction = '', isApplicable=0) {

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.uid = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        if (!this.uid) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.uid = +pathSegments[4];
        }

        if (!this.uid) {
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

        // console.log('this.isUpdatedAction === ', this.isUpdatedAction);
        // return 0;
        if (!this.isUpdatedAction) {
            this._researchProfileMultiFormService.saveData(this.professionalExperienceList, null, 'ProfassionalExprience').subscribe(data => {
                if (data.success) {
                    this._toastrService.success(data.message);
                } else {
                    this._toastrService.error(data.message);
                }
            }, error => {
                this._toastrService.error("Save unsuccessful");
            })
        } else {
            this._researchProfileMultiFormService.updateData(this.uid, this.professionalExperienceList, null, 'ProfassionalExprience').subscribe(data => {
                if (data.success) {
                    if (forAction == '') {
                        this._toastrService.success(data.message);
                    }
                    if (forAction == 'delete') {
                        this._toastrService.success('Deleted successfully');
                    }

                } else {
                    this._toastrService.error(data.message);
                }
            }, error => {
                this._toastrService.error("Save unsuccessful");
            })
        }
    }

    async saveAndNext(isApplicable) {

        if (localStorage.getItem("profilePersonalInfoId") != null) {
            this.uid = +(localStorage.getItem("profilePersonalInfoId"));
            this.isUpdatedAction = true;
        }

        if (!this.uid) {
            const pathSegments = this._location.path().split('/');
            this.uuid = pathSegments[2];
            this.uid = +pathSegments[4];
        }

        if (!this.uid) {
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
        await this.save();
        await this.nextTab();
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

    nextTab() {
        this.nextStep.emit(true);
    }

    addNewForm() {
        this.professionalExperienceList.push(
            {
                id: null,
                profilePersonalInfoId: null,
                organizationName: '',
                designation: '',
                isGovEmployee: null,
                fromDate: null,
                toDate: null,
                isContinue: false,
                responsibilityDetail: '',
                uploadRelevantDoc: '',
                isEditable: false,
                isToDateDisable: false

            }
        )
    }

    async deleteFormByIndex(index: number) {
        await this.professionalExperienceList.splice(index, 1);
        await this.save('delete');
    }

    disableToField(event: MatCheckboxChange, index) {
        this.professionalExperienceList[index].isToDateDisable = event.checked;
        this.isToDateDisable = event.checked;
        this.professionalExperienceList[index].toDate = null;
    }

    radioChange(val) {
        console.log('event = ', val);

        sessionStorage.setItem('proExperience', val);
        var retrievedObject = sessionStorage.getItem('proExperience');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));

        console.log('this.rmsProfileNotApplicable', this.rmsProfileNotApplicable);

        let rasult = this.professionalExperienceList.some(s => s.id != null);
        if (rasult) {
            this._toastrService.error("First delete the professional information");
            setTimeout(() => { this.isApplicable = 2; }, 100 / 99);
            return;
        }
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
                this.deleteFormByIndex(i);
            }
            dialogRef.close(true);
        });
    }
}
