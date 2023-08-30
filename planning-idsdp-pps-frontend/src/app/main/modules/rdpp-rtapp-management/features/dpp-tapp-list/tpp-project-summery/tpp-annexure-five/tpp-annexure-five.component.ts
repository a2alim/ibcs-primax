/*----Lng Translation----*/
import {Component, OnInit} from '@angular/core';
import {TppAnnexureThree} from '../../../../models/Tpp-Annexure-three.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../tab-forms/annexure-goods/i18n/en';
import {locale as lngBangla} from '../../tab-forms/annexure-goods/i18n/bn';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {TppAnnexureFiveService} from 'app/main/modules/dpp-tapp-management/services/tpp-annexure-five.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";

/*----/Lng Translation----*/

@Component({
    selector: 'app-tpp-annexure-five',
    templateUrl: './tpp-annexure-five.component.html',
    styleUrls: ['./tpp-annexure-five.component.scss'],
})
export class TppAnnexureFiveComponent implements OnInit {
    count: number = 0;
    form: FormGroup;
    pcMasterId: number;
    completionDate: any;
    projectTitle: any;
    totalCost: any;
    commencementDate: any;
    conceptUuid = this.route.snapshot.params['id'];

    spinner: boolean;
    tppProjectAnnexureThreeModelList: Array<TppAnnexureThree> =
        new Array<TppAnnexureThree>();

    constructor(
        private fb: FormBuilder,
        private matSnackBar: SnackbarHelper,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private tppAnnexureFiveService: TppAnnexureFiveService,
        private dialog: MatDialog,
        private pcService: ProjectSummaryService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private route: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.form = this.fb.group({
            projectConceptUuid: this.conceptUuid,
            list: this.fb.array([]),
        });
    }


    ngOnInit(): void {
        this.getPcData();
        this.setFormFieldValue();
    }

    get list() {
        return this.form.controls['list'] as FormArray;
    }

    /*------------------Add new rows------------------*/
    addNewRow() {
        const row = this.fb.group({
            id: [''],
            uuid: [''],
            designation: ['', Validators.required],
            educationalQualifications: ['', Validators.required],
            experiences: ['', Validators.required],
            tasksPerformed: ['', Validators.required],
            projectConceptUuid: this.conceptUuid,
        });
        this.list.push(row);
    }

    /*------------------Delete confirmation dialog box------------------*/
    private deleteRow(rowIndex) {

        const arrayControl = this.form.get('list') as FormArray;
        var rowId = arrayControl.at(rowIndex).value.id;

        console.log('arrayControl', rowId);

        if (rowId == '') {
            this.removeRow(rowIndex);
        } else {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.autoFocus = false;
            dialogConfig.width = ConfirmDialogConstant.WIDTH;
            dialogConfig.height = ConfirmDialogConstant.HEIGHT;
            dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
            dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
            const dialogRef = this.dialog.open(
                SubmitConfirmationDialogComponent,
                dialogConfig
            );
            dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
                if (res) {
                    this.delete(rowId);
                }
                dialogRef.close(true);
            });
        }

    }

    /*------------------Delete record from database table------------------*/
    delete(rowUuid) {
        this.spinner = true;
        this.tppAnnexureFiveService.delete(rowUuid).subscribe((res) => {
            this.matSnackBar.openSuccessSnackBarWithMessage(
                'Deleted Successfully',
                'Ok'
            );
            this.setFormFieldValue();
            this.spinner = false;
        });
    }

    removeRow(rowId: number) {
        if (this.list.length === 1) {
            return false;
        } else {
            console.log('rowId = ', rowId);
            this.list.removeAt(rowId);
            return true;
        }
    }

    /*---- Get data from database table and set field values----*/
    setFormFieldValue() {
        this.tppAnnexureFiveService.getData("get-list/" + this.conceptUuid).subscribe((res) => {
            this.form.setControl('list', this.fb.array([]));
            this.form.controls['projectConceptUuid'].patchValue(this.conceptUuid);

            if (res.length > 0) {
                res.forEach((val) => {
                    const row = this.fb.group({
                        id: [val.id],
                        uuid: [val.uuid],
                        designation: [val.designation, Validators.required],
                        educationalQualifications: [
                            val.educationalQualifications,
                            Validators.required,
                        ],
                        experiences: [val.experiences, Validators.required],
                        tasksPerformed: [
                            val.tasksPerformed,
                            Validators.required,
                        ],
                        projectConceptUuid: this.conceptUuid,
                    });
                    this.list.push(row);
                });
            } else {
                const row = this.fb.group({
                    id: [''],
                    uuid: [''],
                    designation: ['', Validators.required],
                    educationalQualifications: ['', Validators.required],
                    experiences: ['', Validators.required],
                    tasksPerformed: ['', Validators.required],
                    projectConceptUuid: this.conceptUuid,
                });
                this.list.push(row);
            }
        });
    }

    /*----Check form validation----*/
    onSubmit() {
        if (this.form.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    /*----Save Records into the database table----*/
    saveData() {
        this.spinner = true;
        this.tppAnnexureFiveService.create(this.form.value).subscribe((res: any) => {
            //this.matSnackBar.openSuccessSnackBar();
            this.matSnackBar.openSuccessSnackBarWithMessage(res.message, "Ok");
            if (res.status > 0) {
                this.setFormFieldValue();
            }
            this.spinner = false;

        });
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    getPcData() {
        this.pcService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.pcMasterId = res.id;
            this.projectTitle = res.titleEn;
            this.totalCost = res.totalAmount;
            this.commencementDate = res.expCommencementDate;
            this.completionDate = res.expCompletionDate;
            this.getMasterTableData();
        })
    }

    getMasterTableData() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) => {
            this.projectTitle = response.res.projectTitleEn ? response.res.projectTitleEn: this.projectTitle;
            this.commencementDate = response.res.expCommencementDate ? response.res.expCommencementDate: this.commencementDate;
            this.completionDate = response.res.expCompletionDate ? response.res.expCompletionDate: this.completionDate;
        })
    }
}
