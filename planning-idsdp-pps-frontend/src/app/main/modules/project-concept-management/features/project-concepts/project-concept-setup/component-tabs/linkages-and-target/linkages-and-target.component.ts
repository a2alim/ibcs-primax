import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { BehaviorSubject } from 'rxjs';
import { LinkagesAndTargetSdgsModel } from '../../../../../models/linkages-and-target-sdgs.model';
import { LinkagesAndTargetFiveYearPlanModel } from '../../../../../models/linkages-and-target-five-year-plan.model';
import { LinkagesAndTargetPerspectivePlanModel } from '../../../../../models/linkages-and-target-perspective-plan.model';
import { LinkagesAndTargetDeltaPlanModel } from '../../../../../models/linkages-and-target-delta-plan.model';
import { LinkagesAndTargetClimateChangeModel } from '../../../../../models/linkages-and-target-climate-change.model';
import { LinkagesAndTargetPovertyModel } from '../../../../../models/linkages-and-target-poverty.model';
import { LinkagesAndTargetGenderModel } from '../../../../../models/linkages-and-target-gender.model';
import { LinkagesAndTargetService } from '../../../../../services/linkages-and-target.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadService } from '../../../../../../../core/services/file-upload.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {ERROR, FAILED_DELETE, OK, SUCCESSFULLY_DELETED} from '../../../../../../../core/constants/message';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ProjectConceptService} from '../../../../../services/project-concept.service';
import {Router} from '@angular/router';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-linkages-and-target',
    templateUrl: './linkages-and-target.component.html',
    styleUrls: ['./linkages-and-target.component.scss'],
})
export class LinkagesAndTargetComponent implements OnInit {

    @Input() projectConceptMasterId: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    attachmentEnable: boolean;
    attachmentEnableFiveYearPlan: boolean;
    attachmentEnablePerspectivePlan: boolean;
    attachmentEnableDeltaPlan: boolean;
    attachmentEnableClimateChange: boolean;
    attachmentEnablePoverty: boolean;
    attachmentEnableGender: boolean;

    attachmentEnableUpdateSdgs: boolean;
    attachmentEnableUpdateFiveYearPlan: boolean;
    attachmentEnableUpdatePerspectivePlan: boolean;
    attachmentEnableUpdateDeltaPlan: boolean;
    attachmentEnableUpdateClimateChange: boolean;
    attachmentEnableUpdatePoverty: boolean;
    attachmentEnableUpdateGender: boolean;


    sdgsTrue: string;
    fiveYearTrue: string;
    perspectivePlanTrue: string;
    deltaPlanTrue: string;
    climateTrue: string;
    povertyTrue: string;
    genderTrue: string;

    file: File;
    file1: File;
    file2: File;
    file3: File;
    file4: File;
    file5: File;
    file6: File;

    data = [];
    data1 = [];
    data2 = [];
    data3 = [];
    data4 = [];
    data5 = [];
    data6 = [];

    isSDGS: boolean;
    isFiveYearPlan: boolean;
    isClimateChange: boolean;
    isPovertyChange: boolean;
    isGenderChange: boolean;
    isDeltaPlanChange: boolean;
    isPerspectivePlanChange: boolean;

    isAttachmentValidate: boolean = true;
    isGoalsValidate: boolean = true;
    isTargetValidate: boolean = true;
    isIndicatorValidate: boolean = true;

    canUpdate: boolean;
    canUpdate1: boolean;
    canUpdate2: boolean;
    canUpdate3: boolean;
    canUpdate4: boolean;
    canUpdate5: boolean;
    canUpdate6: boolean;

    canUpdateLinkage: boolean;

    spinner: boolean;

    updateAttachment: boolean;
    updateAttachment1: boolean;
    updateAttachment2: boolean;
    updateAttachment3: boolean;
    updateAttachment4: boolean;
    updateAttachment5: boolean;
    updateAttachment6: boolean;

    sdgsModel: LinkagesAndTargetSdgsModel[] = new Array<LinkagesAndTargetSdgsModel>();
    fiveYearModel: LinkagesAndTargetFiveYearPlanModel[] = new Array<LinkagesAndTargetFiveYearPlanModel>();
    perspectivePlanModel: LinkagesAndTargetPerspectivePlanModel[] = new Array<LinkagesAndTargetPerspectivePlanModel>();
    deltaPlanModel: LinkagesAndTargetDeltaPlanModel[] = new Array<LinkagesAndTargetDeltaPlanModel>();
    climateModel: LinkagesAndTargetClimateChangeModel[] = new Array<LinkagesAndTargetClimateChangeModel>();
    povertyModel: LinkagesAndTargetPovertyModel[] = new Array<LinkagesAndTargetPovertyModel>();
    genderModel: LinkagesAndTargetGenderModel[] = new Array<LinkagesAndTargetGenderModel>();

    dataSource1 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource2 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource3 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource4 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource5 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource6 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource7 = new BehaviorSubject<AbstractControl[]>([]);

    displayColumns = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns1 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns2 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns3 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns4 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns5 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    displayColumns6 = [
        'sl',
        'goals',
        'targets',
        'indicator',
        'attachment',
        'action',
    ];

    //initialized tables in form array
    rows: FormArray = this.fb1.array([]);
    rows1: FormArray = this.fb2.array([]);
    rows2: FormArray = this.fb3.array([]);
    rows3: FormArray = this.fb4.array([]);
    rows4: FormArray = this.fb5.array([]);
    rows5: FormArray = this.fb6.array([]);
    rows6: FormArray = this.fb7.array([]);

    //initialized sdgs in form array
    form: FormGroup = this.fb1.group({
        sdgs: this.rows,
    });

    //initialized five year plan in form array
    form1: FormGroup = this.fb2.group({
        fiveYearPlan: this.rows1,
    });

    //initialized perspective plan in form array
    form2: FormGroup = this.fb3.group({
        perspectivePlan: this.rows2,
    });

    //initialized delta plan in form array
    form3: FormGroup = this.fb4.group({
        deltaPlan: this.rows3,
    });

    //initialized climate in form array
    form4: FormGroup = this.fb5.group({
        climateChange: this.rows4,
    });

    //initialized poverty in form array
    form5: FormGroup = this.fb6.group({
        povertyChange: this.rows5,
    });

    //initialized gender in form array
    form6: FormGroup = this.fb7.group({
        genderChange: this.rows6,
    });

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fb1: FormBuilder,
        private fb2: FormBuilder,
        private fb3: FormBuilder,
        private fb4: FormBuilder,
        private fb5: FormBuilder,
        private fb6: FormBuilder,
        private fb7: FormBuilder,
        private snackBar: SnackbarHelper,
        private matDialog: MatDialog,
        private router: Router,
        private linkagesAndTargetService: LinkagesAndTargetService,
        private fileUploadService: FileUploadService,
        private projectConceptService: ProjectConceptService,
        private _snackBar: MatSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    //form initialization
    ngOnInit(): void {
        //get linkage and target list in initial phase
        if (this.projectConceptMasterId) {
            this.getLinkageAndTargetList();
        } else {
            this.sdgsTrue = 'false';
            this.fiveYearTrue = 'false';
            this.perspectivePlanTrue = 'false';
            this.deltaPlanTrue = 'false';
            this.climateTrue = 'false';
            this.povertyTrue = 'false';
            this.genderTrue = 'false';
        }

        //sdgs table column initial
        const row = this.fb1.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'sdgs',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //five year plan table column initial
        const row1 = this.fb2.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'fiveYearPlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //perspective plan table column initial
        const row2 = this.fb3.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'perspectivePlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //delta plan table column initial
        const row3 = this.fb4.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'deltaPlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //climate table column initial
        const row4 = this.fb5.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'climate',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //poverty table column initial
        const row5 = this.fb6.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'poverty',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        //gender table column initial
        const row6 = this.fb7.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'gender',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });

        this.rows.push(row);
        this.rows1.push(row1);
        this.rows2.push(row2);
        this.rows3.push(row3);
        this.rows4.push(row4);
        this.rows5.push(row5);
        this.rows6.push(row6);

        this.data.forEach(() => this.addRow());
        this.data1.forEach(() => this.addRow1());
        this.data2.forEach(() => this.addRow2());
        this.data3.forEach(() => this.addRow3());
        this.data4.forEach(() => this.addRow4());
        this.data5.forEach(() => this.addRow5());
        this.data6.forEach(() => this.addRow6());

        this.updateView();
        this.updateView1();
        this.updateView2();
        this.updateView3();
        this.updateView4();
        this.updateView5();
        this.updateView6();
    }

    //empty sdgs table row on delete button click
    emptyTable(index): any {
        if (this.rows.length === 1) {
            this.rows.clear();
            this.addRow();
            this.updateView();
            this.attachmentEnableUpdateSdgs= false;
            this.attachmentEnable = false;
            this.sdgsModel.splice(index);
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            this.sdgsModel.splice(index, 1);
            return true;
        }
    }

    //empty five year plan table row on delete button click
    emptyTable1(index): any {
        if (this.rows1.length === 1) {
            this.rows1.clear();
            this.addRow1();
            this.updateView1();
            this.attachmentEnableUpdateFiveYearPlan = false;
            this.attachmentEnableFiveYearPlan = false;
            this.fiveYearModel.splice(index);
            return false;
        } else {
            this.rows1.removeAt(index);
            this.updateView1();
            this.fiveYearModel.splice(index, 1);
            return true;
        }
    }

    //empty perspective plan table row on delete button click
    emptyTable2(index): any {
        if (this.rows2.length === 1) {
            this.rows2.clear();
            this.addRow2();
            this.updateView2();
            this.attachmentEnableUpdatePerspectivePlan= false;
            this.attachmentEnablePerspectivePlan = false;
            this.perspectivePlanModel.splice(index);
            return false;
        } else {
            this.rows2.removeAt(index);
            this.updateView2();
            this.perspectivePlanModel.splice(index, 1);
            return true;
        }
    }

    //empty delta plan table row on delete button click
    emptyTable3(index): any {
        if (this.rows3.length === 1) {
            this.rows3.clear();
            this.addRow3();
            this.updateView3();
            this.attachmentEnableUpdateDeltaPlan= false;
            this.attachmentEnableDeltaPlan = false;
            this.deltaPlanModel.splice(index);
            return false;
        } else {
            this.rows3.removeAt(index);
            this.updateView3();
            this.deltaPlanModel.splice(index, 1);
            return true;
        }
    }

    //empty climate table row on delete button click
    emptyTable4(index): any {
        if (this.rows4.length === 1) {
            this.rows4.clear();
            this.addRow4();
            this.updateView4();
            this.attachmentEnableUpdateClimateChange= false;
            this.attachmentEnableClimateChange = false;
            this.climateModel.splice(index);
            return false;
        } else {
            this.rows4.removeAt(index);
            this.updateView4();
            this.climateModel.splice(index, 1);
            return true;
        }
    }

    //empty poverty table row on delete button click
    emptyTable5(index): any {
        if (this.rows5.length === 1) {
            this.rows5.clear();
            this.addRow5();
            this.updateView5();
            this.attachmentEnableUpdatePerspectivePlan= false;
            this.attachmentEnablePerspectivePlan = false;
            this.povertyModel.splice(index);
            return false;
        } else {
            this.rows5.removeAt(index);
            this.updateView5();
            this.povertyModel.splice(index, 1);
            return true;
        }
    }

    //empty gender table row on delete button click
    emptyTable6(index): any {
        if (this.rows6.length === 1) {
            this.rows6.clear();
            this.addRow6();
            this.updateView6();
            this.attachmentEnableUpdateGender= false;
            this.attachmentEnableGender = false;
            this.genderModel.splice(index);
            return false;
        } else {
            this.rows6.removeAt(index);
            this.updateView6();
            this.genderModel.splice(index, 1);
            return true;
        }
    }

    //add sdgs table row on plus button click
    addRow(): any {
        const row = this.fb1.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'sdgs',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows.push(row);
        this.updateView();
    }

    //add five year plan table row on plus button click
    addRow1(): any {
        const row1 = this.fb2.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'fiveYearPlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows1.push(row1);
        this.updateView1();
    }

    //add perspective plan table row on plus button click
    addRow2(): any {
        const row2 = this.fb3.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'perspectivePlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows2.push(row2);
        this.updateView2();
    }

    //add delta plan table row on plus button click
    addRow3(): any {
        const row3 = this.fb4.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'deltaPlan',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows3.push(row3);
        this.updateView3();
    }

    //add climate table row on plus button click
    addRow4(): any {
        const row4 = this.fb5.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'climate',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows4.push(row4);
        this.updateView4();
    }

    //add poverty table row on plus button click
    addRow5(): any {
        const row5 = this.fb6.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'poverty',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows5.push(row5);
        this.updateView5();
    }

    //add gender table row on plus button click
    addRow6(): any {
        const row6 = this.fb7.group({
            goals: '',
            targets: '',
            indicator: '',
            type: 'gender',
            attachmentId: '',
            attachmentName: '',
            uuid: '',
        });
        this.rows6.push(row6);
        this.updateView6();
    }

    //update sdgs table view after plus or delete button click
    updateView(): any {
        this.dataSource1.next(this.rows.controls);
    }

    //update five year plan table view after plus or delete button click
    updateView1(): any {
        this.dataSource2.next(this.rows1.controls);
    }

    //update perspective plan table view after plus or delete button click
    updateView2(): any {
        this.dataSource3.next(this.rows2.controls);
    }

    //update delta plan table view after plus or delete button click
    updateView3(): any {
        this.dataSource4.next(this.rows3.controls);
    }

    //update climate table view after plus or delete button click
    updateView4(): any {
        this.dataSource5.next(this.rows4.controls);
    }

    //update poverty table view after plus or delete button click
    updateView5(): any {
        this.dataSource6.next(this.rows5.controls);
    }

    //update gender table view after plus or delete button click
    updateView6(): any {
        this.dataSource7.next(this.rows6.controls);
    }

    //For create linkage and target
    saveAndNext() {
        if (!this.isDeltaPlanChange && !this.isClimateChange && !this.isGenderChange && !this.isSDGS &&
            !this.isPovertyChange && !this.isPerspectivePlanChange && !this.isFiveYearPlan) {
            if (this.sdgsModel.length === 0 && this.fiveYearModel.length === 0 && this.perspectivePlanModel.length === 0
                && this.deltaPlanModel.length === 0 && this.climateModel.length === 0 && this.povertyModel.length === 0 && this.genderModel.length === 0)
            {
                this.nextStep.emit(true);
                this.snackBar.openSuccessSnackBar();
            }
        } else {
            this.isAttachmentValidate = true;
            this.isGoalsValidate = true;
            this.isTargetValidate = true;
            this.isIndicatorValidate = true;
            if (this.isSDGS) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    if (!this.rows.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isFiveYearPlan) {
                for (let i = 0; i < this.rows1.getRawValue().length; i++) {
                    if (!this.rows1.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }

                }
            }
            if (this.isPerspectivePlanChange) {
                for (let i = 0; i < this.rows2.getRawValue().length; i++) {
                    if (!this.rows2.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isDeltaPlanChange) {
                for (let i = 0; i < this.rows3.getRawValue().length; i++) {
                    if (!this.rows3.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isClimateChange) {
                for (let i = 0; i < this.rows4.getRawValue().length; i++) {
                    if (!this.rows4.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isPovertyChange) {
                for (let i = 0; i < this.rows5.getRawValue().length; i++) {
                    if (!this.rows5.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isGenderChange) {
                for (let i = 0; i < this.rows6.getRawValue().length; i++) {
                    if (!this.rows6.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (!this.isAttachmentValidate || !this.isGoalsValidate || !this.isTargetValidate || !this.isIndicatorValidate) {
                return;
            }

            if (this.attachmentEnable) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    this.sdgsModel[i].goals = this.form.value.sdgs[i].goals;
                    this.sdgsModel[i].targets = this.form.value.sdgs[i].targets;
                    this.sdgsModel[i].indicator = this.form.value.sdgs[i].indicator;
                    this.sdgsModel[i].type = 'sdgs';
                }
            } else {
                this.sdgsModel = [];
                this.rows.getRawValue().forEach((e) => {
                    this.sdgsModel.push(e);
                });
            }

            if (this.attachmentEnableFiveYearPlan) {
                for (let i = 0; i < this.rows1.getRawValue().length; i++) {
                    this.fiveYearModel[i].goals = this.form1.value.fiveYearPlan[i].goals;
                    this.fiveYearModel[i].targets = this.form1.value.fiveYearPlan[i].targets;
                    this.fiveYearModel[i].indicator = this.form1.value.fiveYearPlan[i].indicator;
                    this.fiveYearModel[i].type = 'fiveYearPlan';
                }
            } else {
                this.fiveYearModel = [];
                this.rows1.getRawValue().forEach((e) => {
                    this.fiveYearModel.push(e);
                });
            }

            if (this.attachmentEnablePerspectivePlan) {
                for (let i = 0; i < this.rows2.getRawValue().length; i++) {
                    this.perspectivePlanModel[i].goals = this.form2.value.perspectivePlan[i].goals;
                    this.perspectivePlanModel[i].targets = this.form2.value.perspectivePlan[i].targets;
                    this.perspectivePlanModel[i].indicator = this.form2.value.perspectivePlan[i].indicator;
                    this.perspectivePlanModel[i].type = 'perspectivePlan';
                }
            } else {
                this.perspectivePlanModel = [];
                this.rows2.getRawValue().forEach((e) => {
                    this.perspectivePlanModel.push(e);
                });
            }

            if (this.attachmentEnableDeltaPlan) {
                for (let i = 0; i < this.rows3.getRawValue().length; i++) {
                    this.deltaPlanModel[i].goals = this.form3.value.deltaPlan[i].goals;
                    this.deltaPlanModel[i].targets = this.form3.value.deltaPlan[i].targets;
                    this.deltaPlanModel[i].indicator = this.form3.value.deltaPlan[i].indicator;
                    this.deltaPlanModel[i].type = 'deltaPlan';
                }
            } else {
                this.deltaPlanModel = [];
                this.rows3.getRawValue().forEach((e) => {
                    this.deltaPlanModel.push(e);
                });
            }

            if (this.attachmentEnableClimateChange) {
                for (let i = 0; i < this.rows4.getRawValue().length; i++) {
                    this.climateModel[i].goals = this.form4.value.climateChange[i].goals;
                    this.climateModel[i].targets = this.form4.value.climateChange[i].targets;
                    this.climateModel[i].indicator = this.form4.value.climateChange[i].indicator;
                    this.climateModel[i].type = 'climate';
                }
            } else {
                this.climateModel = [];
                this.rows4.getRawValue().forEach((e) => {
                    this.climateModel.push(e);
                });
            }

            if (this.attachmentEnablePoverty) {
                for (let i = 0; i < this.rows5.getRawValue().length; i++) {
                    this.povertyModel[i].goals = this.form5.value.povertyChange[i].goals;
                    this.povertyModel[i].targets = this.form5.value.povertyChange[i].targets;
                    this.povertyModel[i].indicator = this.form5.value.povertyChange[i].indicator;
                    this.povertyModel[i].type = 'poverty';
                }
            } else {
                this.povertyModel = [];
                this.rows5.getRawValue().forEach((e) => {
                    this.povertyModel.push(e);
                });
            }

            if (this.attachmentEnableGender) {
                for (let i = 0; i < this.rows6.getRawValue().length; i++) {
                    this.genderModel[i].goals = this.form6.value.genderChange[i].goals;
                    this.genderModel[i].targets = this.form6.value.genderChange[i].targets;
                    this.genderModel[i].indicator = this.form6.value.genderChange[i].indicator;
                    this.genderModel[i].type = 'gender';
                }
            } else {
                this.genderModel = [];
                this.rows6.getRawValue().forEach((e) => {
                    this.genderModel.push(e);
                });
            }
            this.spinner = true;
            this.linkagesAndTargetService
                .createLinkageAndTarget(this.sdgsModel, this.fiveYearModel, this.perspectivePlanModel, this.deltaPlanModel, this.climateModel, this.povertyModel, this.genderModel, this.projectConceptService.projectSummaryCreateId)
                .subscribe((res) => {
                    if (res.status === 200) {
                        this.snackBar.openSuccessSnackBar();
                    }
                    this.rows.reset();
                    this.rows1.reset();
                    this.rows2.reset();
                    this.rows3.reset();
                    this.rows4.reset();
                    this.rows5.reset();
                    this.rows6.reset();
                    this.rows.clear();
                    this.rows1.clear();
                    this.rows2.clear();
                    this.rows3.clear();
                    this.rows4.clear();
                    this.rows5.clear();
                    this.rows6.clear();
                    this.addRow();
                    this.addRow1();
                    this.addRow2();
                    this.addRow3();
                    this.addRow4();
                    this.addRow5();
                    this.addRow6();
                    this.sdgsModel = [];
                    this.fiveYearModel = [];
                    this.perspectivePlanModel = [];
                    this.deltaPlanModel = [];
                    this.climateModel = [];
                    this.povertyModel = [];
                    this.genderModel = [];
                    this.getLinkageAndTargetList();
                    this.nextStep.emit(true);
                    this.spinner = false;
                }, err => {
                    this.snackBar.openErrorSnackBar();
                    this.spinner = false;
                });

        }



    }

    //For create linkage and target
    saveAndExit() {
        if (!this.isDeltaPlanChange && !this.isClimateChange && !this.isGenderChange && !this.isSDGS &&
            !this.isPovertyChange && !this.isPerspectivePlanChange && !this.isFiveYearPlan) {
            if (this.sdgsModel.length === 0 && this.fiveYearModel.length === 0 && this.perspectivePlanModel.length === 0
                && this.deltaPlanModel.length === 0 && this.climateModel.length === 0 && this.povertyModel.length === 0 && this.genderModel.length === 0)
            {
                this.router.navigate([`project-concept`]);
                this.snackBar.openSuccessSnackBar();
                this.spinner = false;
            }
        } else {
            this.isAttachmentValidate = true;
            this.isGoalsValidate = true;
            this.isTargetValidate = true;
            this.isIndicatorValidate = true;
            if (this.isSDGS) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    if (!this.rows.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isFiveYearPlan) {
                for (let i = 0; i < this.rows1.getRawValue().length; i++) {
                    if (!this.rows1.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows1.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isPerspectivePlanChange) {
                for (let i = 0; i < this.rows2.getRawValue().length; i++) {
                    if (!this.rows2.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows2.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isDeltaPlanChange) {
                for (let i = 0; i < this.rows3.getRawValue().length; i++) {
                    if (!this.rows3.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows3.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isClimateChange) {
                for (let i = 0; i < this.rows4.getRawValue().length; i++) {
                    if (!this.rows4.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows4.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isPovertyChange) {
                for (let i = 0; i < this.rows5.getRawValue().length; i++) {
                    if (!this.rows5.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows5.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (this.isGenderChange) {
                for (let i = 0; i < this.rows6.getRawValue().length; i++) {
                    if (!this.rows6.getRawValue()[i].attachmentId) {
                        this.isAttachmentValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].goals) {
                        this.isGoalsValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].targets) {
                        this.isTargetValidate = false;
                    }
                    if (!this.rows6.getRawValue()[i].indicator) {
                        this.isIndicatorValidate = false;
                    }
                }
            }
            if (!this.isAttachmentValidate || !this.isGoalsValidate || !this.isTargetValidate || !this.isIndicatorValidate) {
                return;
            }

            if (this.attachmentEnable) {
                for (let i = 0; i < this.rows.getRawValue().length; i++) {
                    this.sdgsModel[i].goals = this.form.value.sdgs[i].goals;
                    this.sdgsModel[i].targets = this.form.value.sdgs[i].targets;
                    this.sdgsModel[i].indicator = this.form.value.sdgs[i].indicator;
                    this.sdgsModel[i].type = 'sdgs';
                }
            } else {
                this.sdgsModel = [];
                this.rows.getRawValue().forEach((e) => {
                    this.sdgsModel.push(e);
                });
            }

            if (this.attachmentEnableFiveYearPlan) {
                for (let i = 0; i < this.rows1.getRawValue().length; i++) {
                    this.fiveYearModel[i].goals = this.form1.value.fiveYearPlan[i].goals;
                    this.fiveYearModel[i].targets = this.form1.value.fiveYearPlan[i].targets;
                    this.fiveYearModel[i].indicator = this.form1.value.fiveYearPlan[i].indicator;
                    this.fiveYearModel[i].type = 'fiveYearPlan';
                }
            } else {
                this.fiveYearModel = [];
                this.rows1.getRawValue().forEach((e) => {
                    this.fiveYearModel.push(e);
                });
            }

            if (this.attachmentEnablePerspectivePlan) {
                for (let i = 0; i < this.rows2.getRawValue().length; i++) {
                    this.perspectivePlanModel[i].goals = this.form2.value.perspectivePlan[i].goals;
                    this.perspectivePlanModel[i].targets = this.form2.value.perspectivePlan[i].targets;
                    this.perspectivePlanModel[i].indicator = this.form2.value.perspectivePlan[i].indicator;
                    this.perspectivePlanModel[i].type = 'perspectivePlan';
                }
            } else {
                this.perspectivePlanModel = [];
                this.rows2.getRawValue().forEach((e) => {
                    this.perspectivePlanModel.push(e);
                });
            }

            if (this.attachmentEnableDeltaPlan) {
                for (let i = 0; i < this.rows3.getRawValue().length; i++) {
                    this.deltaPlanModel[i].goals = this.form3.value.deltaPlan[i].goals;
                    this.deltaPlanModel[i].targets = this.form3.value.deltaPlan[i].targets;
                    this.deltaPlanModel[i].indicator = this.form3.value.deltaPlan[i].indicator;
                    this.deltaPlanModel[i].type = 'deltaPlan';
                }
            } else {
                this.deltaPlanModel = [];
                this.rows3.getRawValue().forEach((e) => {
                    this.deltaPlanModel.push(e);
                });
            }

            if (this.attachmentEnableClimateChange) {
                for (let i = 0; i < this.rows4.getRawValue().length; i++) {
                    this.climateModel[i].goals = this.form4.value.climateChange[i].goals;
                    this.climateModel[i].targets = this.form4.value.climateChange[i].targets;
                    this.climateModel[i].indicator = this.form4.value.climateChange[i].indicator;
                    this.climateModel[i].type = 'climate';
                }
            } else {
                this.climateModel = [];
                this.rows4.getRawValue().forEach((e) => {
                    this.climateModel.push(e);
                });
            }

            if (this.attachmentEnablePoverty) {
                for (let i = 0; i < this.rows5.getRawValue().length; i++) {
                    this.povertyModel[i].goals = this.form5.value.povertyChange[i].goals;
                    this.povertyModel[i].targets = this.form5.value.povertyChange[i].targets;
                    this.povertyModel[i].indicator = this.form5.value.povertyChange[i].indicator;
                    this.povertyModel[i].type = 'poverty';
                }
            } else {
                this.povertyModel = [];
                this.rows5.getRawValue().forEach((e) => {
                    this.povertyModel.push(e);
                });
            }

            if (this.attachmentEnableGender) {
                for (let i = 0; i < this.rows6.getRawValue().length; i++) {
                    this.genderModel[i].goals = this.form6.value.genderChange[i].goals;
this.genderModel[i].targets = this.form6.value.genderChange[i].targets;
this.genderModel[i].indicator = this.form6.value.genderChange[i].indicator;
this.genderModel[i].type = 'gender';
}
} else {
    this.genderModel = [];
    this.rows6.getRawValue().forEach((e) => {
        this.genderModel.push(e);
    });
}
this.spinner = true;
this.linkagesAndTargetService
    .createLinkageAndTarget(this.sdgsModel, this.fiveYearModel, this.perspectivePlanModel, this.deltaPlanModel, this.climateModel, this.povertyModel, this.genderModel, this.projectConceptService.projectSummaryCreateId)
    .subscribe((res) => {
        if (res.status === 200) {
            this.snackBar.openSuccessSnackBar();
        }
        // this.rows.reset();
        // this.rows1.reset();
        // this.rows2.reset();
        // this.rows3.reset();
        // this.rows4.reset();
        // this.rows5.reset();
        // this.rows6.reset();
        // this.rows.clear();
        // this.rows1.clear();
        // this.rows2.clear();
        // this.rows3.clear();
        // this.rows4.clear();
        // this.rows5.clear();
        // this.rows6.clear();
        // this.addRow();
        // this.addRow1();
        // this.addRow2();
        // this.addRow3();
        // this.addRow4();
        // this.addRow5();
        // this.addRow6();
        // this.sdgsModel = [];
        // this.fiveYearModel = [];
        // this.perspectivePlanModel = [];
        // this.deltaPlanModel = [];
        // this.climateModel = [];
        // this.povertyModel = [];
        // this.genderModel = [];
        this.router.navigate([`project-concept`]);
        this.spinner = false;
    }, err => {
        this.snackBar.openErrorSnackBar();
        this.spinner = false;
    });
}
}

//For go previous tab
back(): void {
    this.backPrevious.emit(true);
}

//For upload file in sdgs table
uploadFile(file: FileList, index): any {
    this.file = file.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate) {
            // this.form.value.sdgs[index].attachmentId = res.id;
            this.form.value.sdgs[index].attachmentName = '';
            this.sdgsModel[index] = this.form.value.sdgs[index];
            this.sdgsModel[index].attachmentId = res.id;
            this.updateAttachment = true;
        } else {
            this.sdgsModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            this.attachmentEnableUpdateSdgs = true;
            this.attachmentEnable = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For upload file in five year plan table
uploadFile1(file1: FileList, index): any {
    this.file1 = file1.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file1).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate1) {
            this.form1.value.fiveYearPlan[index].attachmentName = '';
            this.fiveYearModel[index] = this.form1.value.fiveYearPlan[index];
            this.fiveYearModel[index].attachmentId = res.id;
            this.updateAttachment1 = true;
        } else {
            this.fiveYearModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            this.attachmentEnableUpdateFiveYearPlan = true;
            this.attachmentEnableFiveYearPlan = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });

}

//For upload file in perspective plan table
uploadFile2(file2: FileList, index1): any {
    this.file2 = file2.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file2).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate2) {
            this.form2.value.perspectivePlan[index1].attachmentName = '';
            this.perspectivePlanModel[index1] = this.form2.value.perspectivePlan[index1];
            this.perspectivePlanModel[index1].attachmentId = res.id;
            this.updateAttachment2 = true;
        } else {
            this.perspectivePlanModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            // this.perspectivePlanModel[index] = this.form2.value.perspectivePlan[index];
            // this.perspectivePlanModel[index].attachmentId = res.id;
            this.attachmentEnableUpdatePerspectivePlan = true;
            this.attachmentEnablePerspectivePlan = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For upload file in delta plan table
uploadFile3(file3: FileList, index): any {
    this.file3 = file3.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file3).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate3) {
            this.form3.value.deltaPlan[index].attachmentName = '';
            this.deltaPlanModel[index] = this.form3.value.deltaPlan[index];
            this.deltaPlanModel[index].attachmentId = res.id;
            this.updateAttachment3 = true;
        } else {
            this.deltaPlanModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });

            this.attachmentEnableUpdateDeltaPlan = true;
            this.attachmentEnableDeltaPlan = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For upload file in climate table
uploadFile4(file4: FileList, index): any {
    this.file4 = file4.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file4).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate4) {
            this.form4.value.climateChange[index].attachmentName = '';
            this.climateModel[index] = this.form4.value.climateChange[index];
            this.climateModel[index].attachmentId = res.id;
            this.updateAttachment4 = true;
        } else {
            this.climateModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            this.attachmentEnableUpdateClimateChange = true;
            this.attachmentEnableClimateChange = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For upload file in poverty table
uploadFile5(file5: FileList, index): any {
    this.file5 = file5.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file5).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate5) {
            this.form5.value.povertyChange[index].attachmentName = '';
            this.povertyModel[index] = this.form5.value.povertyChange[index];
            this.povertyModel[index].attachmentId = res.id;
            this.updateAttachment5 = true;
        } else {
            this.povertyModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            this.attachmentEnableUpdatePoverty = true;
            this.attachmentEnablePoverty = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For upload file in gender table
uploadFile6(file6: FileList, index): any {
    this.file6 = file6.item(0);
    this.spinner = true;
    this.fileUploadService.upload(this.file6).subscribe(res => {
        this.snackBar.openSuccessSnackBarWithMessage('Attachment uploaded Successfully', 'Ok');
        if (this.canUpdate6) {
            this.form6.value.genderChange[index].attachmentName = '';
            this.genderModel[index] = this.form6.value.genderChange[index];
            this.genderModel[index].attachmentId = res.id;
            this.updateAttachment6 = true;
        } else {
            this.genderModel.push({
                goals: '',
                targets: '',
                indicator: '',
                type: '',
                attachmentId: res.id,
                attachmentName: '',
                uuid: '',
            });
            this.attachmentEnableUpdateGender = true;
            this.attachmentEnableGender = true;
        }
        this.spinner = false;

    }, err => {
        this.snackBar.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        this.spinner = false;
    });
}

//For get linkage and target
getLinkageAndTargetList(): any {
    this.spinner = true;
    this.linkagesAndTargetService.getLinkageAndTargetListByProject(this.projectConceptMasterId).subscribe(res => {

        console.log(res);

        this.rows.clear();
        this.rows1.clear();
        this.rows2.clear();
        this.rows3.clear();
        this.rows4.clear();
        this.rows5.clear();
        this.rows6.clear();
        if (res.linkageTargetSdgs != null || res.linkageTargetFiveYear != null || res.linkageTargetPerspectivePlan != null || res.linkageTargetDeltaPlan != null || res.linkageTargetClimate != null || res.linkageTargetPoverty != null || res.linkageTargetGender != null){
            if (res.linkageTargetSdgs.length > 0){
                res.linkageTargetSdgs.forEach(re => {
                    const row = this.fb1.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });
                    this.rows.push(row);
                    this.updateView();
                    this.canUpdate = true;
                    // this.canUpdateLinkage = true;
                    this.sdgsModel.push(re);
                });
            } else {
                this.canUpdate = false;
                const row = this.fb1.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'sdgs',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows.push(row);
                this.data.forEach(() => this.addRow());
                this.updateView();
            }
            if (res.linkageTargetFiveYear.length > 0){
                res.linkageTargetFiveYear.forEach(re => {
                    const row1 = this.fb2.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows1.push(row1);
                    this.updateView1();
                    this.canUpdate1 = true;
                    // this.canUpdateLinkage = true;
                    this.fiveYearModel.push(re);
                });
            } else {
                this.canUpdate1 = false;
                const row1 = this.fb2.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'fiveYearPlan',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows1.push(row1);
                this.data1.forEach(() => this.addRow1());
                this.updateView1();
            }
            if (res.linkageTargetPerspectivePlan.length > 0){
                res.linkageTargetPerspectivePlan.forEach(re => {
                    const row2 = this.fb3.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows2.push(row2);
                    this.updateView2();
                    this.canUpdate2 = true;
                    // this.canUpdateLinkage = true;
                    this.perspectivePlanModel.push(re);
                });
            } else {
                this.canUpdate2 = false;
                const row2 = this.fb3.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'perspectivePlan',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows2.push(row2);
                this.data2.forEach(() => this.addRow2());
                this.updateView2();
            }
            if (res.linkageTargetDeltaPlan.length > 0){
                res.linkageTargetDeltaPlan.forEach(re => {
                    const row3 = this.fb4.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows3.push(row3);
                    this.updateView3();
                    this.canUpdate3 = true;
                    // this.canUpdateLinkage = true;
                    this.deltaPlanModel.push(re);
                });
            } else {
                this.canUpdate3 = false;
                const row3 = this.fb4.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'deltaPlan',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows3.push(row3);
                this.data3.forEach(() => this.addRow3());
                this.updateView3();
            }
            if (res.linkageTargetClimate.length > 0){
                res.linkageTargetClimate.forEach(re => {
                    const row4 = this.fb5.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows4.push(row4);
                    this.updateView4();
                    this.canUpdate4 = true;
                    // this.canUpdateLinkage = true;
                    this.climateModel.push(re);
                });
            } else {
                this.canUpdate4 = false;
                const row4 = this.fb5.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'climate',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows4.push(row4);
                this.data4.forEach(() => this.addRow4());
                this.updateView4();
            }
            if (res.linkageTargetPoverty.length > 0){
                res.linkageTargetPoverty.forEach(re => {
                    const row5 = this.fb6.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows5.push(row5);
                    this.updateView5();
                    this.canUpdate5 = true;
                    // this.canUpdateLinkage = true;
                    this.povertyModel.push(re);
                });
            } else {
                this.canUpdate5 = false;
                const row5 = this.fb6.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'poverty',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows5.push(row5);
                this.data5.forEach(() => this.addRow5());
                this.updateView5();
            }
            if (res.linkageTargetGender.length > 0){
                res.linkageTargetGender.forEach(re => {
                    const row6 = this.fb7.group({
                        goals: re.goals,
                        targets: re.targets,
                        indicator: re.indicator,
                        type: re.type,
                        attachmentId: re.attachmentId,
                        attachmentName: re.attachmentName,
                        uuid: re.uuid
                    });

                    this.rows6.push(row6);
                    this.updateView6();
                    this.canUpdate6 = true;
                    // this.canUpdateLinkage = true;
                    this.genderModel.push(re);
                });
            } else {
                this.canUpdate6 = false;
                const row6 = this.fb7.group({
                    goals: '',
                    targets: '',
                    indicator: '',
                    type: 'gender',
                    attachmentId: '',
                    attachmentName: '',
                    uuid: '',
                });
                this.rows6.push(row6);
                this.data6.forEach(() => this.addRow6());
                this.updateView6();
            }
            // tslint:disable-next-line:max-line-length
            if (res.linkageTargetSdgs.length > 0 || res.linkageTargetFiveYear.length > 0 || res.linkageTargetPerspectivePlan.length > 0 || res.linkageTargetDeltaPlan.length > 0 || res.linkageTargetClimate.length > 0 || res.linkageTargetPoverty.length > 0 || res.linkageTargetGender.length > 0){
                this.canUpdateLinkage = true;
            } else {
                this.canUpdateLinkage = false;
            }
            if (this.sdgsModel.length > 0){
                this.isSDGS = true;
                this.sdgsTrue = 'true';
            } else {
                this.isSDGS = false;
                this.sdgsTrue = 'false';
            }
            if (this.fiveYearModel.length > 0){
                this.isFiveYearPlan = true;
                this.fiveYearTrue = 'true';
            } else {
                this.isFiveYearPlan = false;
                this.fiveYearTrue = 'false';
            }
            if (this.perspectivePlanModel.length > 0){
                this.isPerspectivePlanChange = true;
                this.perspectivePlanTrue = 'true';
            } else {
                this.isPerspectivePlanChange = false;
                this.perspectivePlanTrue = 'false';
            }
            if (this.deltaPlanModel.length > 0){
                this.isDeltaPlanChange = true;
                this.deltaPlanTrue = 'true';
            } else {
                this.isDeltaPlanChange = false;
                this.deltaPlanTrue = 'false';
            }
            if (this.climateModel.length > 0){
                this.isClimateChange = true;
                this.climateTrue = 'true';
            } else {
                this.isClimateChange = false;
                this.climateTrue = 'false';
            }
            if (this.povertyModel.length > 0){
                this.isPovertyChange = true;
                this.povertyTrue = 'true';
            } else {
                this.isPovertyChange = false;
                this.povertyTrue = 'false';
            }
            if (this.genderModel.length > 0){
                this.isGenderChange = true;
                this.genderTrue = 'true';
            } else {
                this.isGenderChange = false;
                this.genderTrue = 'false';
            }
        } else {
            this.canUpdate = false;
            const row = this.fb1.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'sdgs',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows.push(row);
            this.data.forEach(() => this.addRow());
            this.updateView();
            // this.canUpdateLinkage = false;
            this.sdgsTrue = 'false';

            this.canUpdate1 = false;
            const row1 = this.fb2.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'fiveYearPlan',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows1.push(row1);
            this.data1.forEach(() => this.addRow1());
            this.updateView1();
            // this.canUpdateLinkage = false;
            this.fiveYearTrue = 'false';

            this.canUpdate2 = false;
            const row2 = this.fb3.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'perspectivePlan',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows2.push(row2);
            this.data2.forEach(() => this.addRow2());
            this.updateView2();
            // this.canUpdateLinkage = false;
            this.perspectivePlanTrue = 'false';

            this.canUpdate3 = false;
            const row3 = this.fb4.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'deltaPlan',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows3.push(row3);
            this.data3.forEach(() => this.addRow3());
            this.updateView3();
            // this.canUpdateLinkage = false;
            this.deltaPlanTrue = 'false';

            this.canUpdate4 = false;
            const row4 = this.fb5.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'climate',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows4.push(row4);
            this.data4.forEach(() => this.addRow4());
            this.updateView4();
            // this.canUpdateLinkage = false;
            this.climateTrue = 'false';

            this.canUpdate5 = false;
            const row5 = this.fb6.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'poverty',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows5.push(row5);
            this.data5.forEach(() => this.addRow5());
            this.updateView5();
            // this.canUpdateLinkage = false;
            this.povertyTrue = 'false';

            this.canUpdate6 = false;
            const row6 = this.fb7.group({
                goals: '',
                targets: '',
                indicator: '',
                type: 'gender',
                attachmentId: '',
                attachmentName: '',
                uuid: '',
            });
            this.rows6.push(row6);
            this.data6.forEach(() => this.addRow6());
            this.updateView6();
            // this.canUpdateLinkage = false;
            this.genderTrue = 'false';
        }
        this.spinner = false;

    });
}

//For download attachment
download(index: any, type: string) {

    if (type === 'sdgs'){
        this.spinner = true;
        this.fileUploadService.getById(this.sdgsModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;

        });
    }

    if (type === 'fiveYearPlan'){
        this.spinner = true;
        this.fileUploadService.getById(this.fiveYearModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    if (type === 'perspectivePlan'){
        this.spinner = true;
        this.fileUploadService.getById(this.perspectivePlanModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    if (type === 'deltaPlan'){
        this.spinner = true;
        this.fileUploadService.getById(this.deltaPlanModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    if (type === 'climate'){
        this.spinner = true;
        this.fileUploadService.getById(this.climateModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    if (type === 'poverty'){
        this.spinner = true;
        this.fileUploadService.getById(this.povertyModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

    if (type === 'gender'){
        this.spinner = true;
        this.fileUploadService.getById(this.genderModel[index]['attachmentId']).subscribe(res => {
            this.fileUploadService.download(res.pathUrl);
            this.spinner = false;
        });
    }

}

//For Delete linkage and target from database
deleteFromDb(row: any, type1: string) {
    if (type1 === 'sdgs'){
        this.spinner = true;
        const uuid = this.sdgsModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

    if (type1 === 'fiveYearPlan'){
        this.spinner= true;
        const uuid = this.fiveYearModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable1(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner= false;
        });
    }

    if (type1 === 'perspectivePlan'){
        this.spinner = true;
        const uuid = this.perspectivePlanModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable2(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

    if (type1 === 'deltaPlan'){
        this.spinner = true;
        const uuid = this.deltaPlanModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable3(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

    if (type1 === 'climate'){
        this.spinner = true;
        const uuid = this.climateModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable4(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner= false;
        });
    }

    if (type1 === 'poverty'){
        this.spinner = true;
        const uuid = this.povertyModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable5(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

    if (type1 === 'gender'){
        this.spinner = true;
        const uuid = this.genderModel[row]['uuid'];
        this.linkagesAndTargetService.deleteLinkageAndTarget(uuid).subscribe(res => {
            if (res) {
                this.snackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                this.emptyTable6(row);
                this.getLinkageAndTargetList();
            } else {
                this.snackBar.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
            this.spinner = false;
        });
    }

}

//For update linkage and target
update(next: boolean) {
    this.spinner = true;
    if (this.updateAttachment || this.updateAttachment1 || this.updateAttachment2 || this.updateAttachment3 || this.updateAttachment4 || this.updateAttachment5 || this.updateAttachment6) {
        this.updateCall(next);
        this.spinner = false;
    } else {
        if(!this.attachmentEnableUpdateSdgs){
            this.sdgsModel = [];
            this.rows.getRawValue().forEach(e => {
                this.sdgsModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdateFiveYearPlan){
            this.fiveYearModel = [];
            this.rows1.getRawValue().forEach(e => {
                this.fiveYearModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdatePerspectivePlan){
            this.perspectivePlanModel = [];
            this.rows2.getRawValue().forEach(e => {
                this.perspectivePlanModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdateDeltaPlan){
            this.deltaPlanModel = [];
            this.rows3.getRawValue().forEach(e => {
                this.deltaPlanModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdateClimateChange){
            this.climateModel = [];
            this.rows4.getRawValue().forEach(e => {
                this.climateModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdatePoverty){
            this.povertyModel = [];
            this.rows5.getRawValue().forEach(e => {
                this.povertyModel.push(e);
            });
        }
        if(!this.attachmentEnableUpdateGender){
            this.genderModel = [];
            this.rows6.getRawValue().forEach(e => {
                this.genderModel.push(e);
            });
        }

        this.updateCall(next);
        this.spinner = false;
    }

}

//For update linkage and target
updateCall(next: boolean) {
    this.isAttachmentValidate = true;
    this.isGoalsValidate = true;
    this.isTargetValidate = true;
    this.isIndicatorValidate = true;
    this.spinner = true;
    if (this.isSDGS){
        for (let i = 0; i < this.rows.getRawValue().length; i++){
            if(!this.rows.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (this.isFiveYearPlan){
        for (let i = 0; i < this.rows1.getRawValue().length; i++){
            if(!this.rows1.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows1.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows1.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows1.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }

        }
    }
    if (this.isPerspectivePlanChange){
        for (let i = 0; i < this.rows2.getRawValue().length; i++){
            if(!this.rows2.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows2.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows2.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows2.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (this.isDeltaPlanChange){
        for (let i = 0; i < this.rows3.getRawValue().length; i++){
            if(!this.rows3.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows3.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows3.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows3.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (this.isClimateChange){
        for (let i = 0; i < this.rows4.getRawValue().length; i++){
            if(!this.rows4.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows4.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows4.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows4.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (this.isPovertyChange){
        for (let i = 0; i < this.rows5.getRawValue().length; i++){
            if(!this.rows5.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows5.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows5.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows5.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (this.isGenderChange){
        for (let i = 0; i < this.rows6.getRawValue().length; i++){
            if(!this.rows6.getRawValue()[i].attachmentId){
                this.isAttachmentValidate = false;
            }
            if(!this.rows6.getRawValue()[i].goals){
                this.isGoalsValidate = false;
            }
            if(!this.rows6.getRawValue()[i].targets){
                this.isTargetValidate = false;
            }
            if(!this.rows6.getRawValue()[i].indicator){
                this.isIndicatorValidate = false;
            }
        }
    }
    if (!this.isAttachmentValidate || !this.isGoalsValidate || !this.isTargetValidate || !this.isIndicatorValidate){
        return;
    }

    if (this.attachmentEnable && this.attachmentEnableUpdateSdgs) {
        for (let i = 0; i < this.rows.getRawValue().length; i++) {
            this.sdgsModel[i].goals = this.form.value.sdgs[i].goals;
            this.sdgsModel[i].targets = this.form.value.sdgs[i].targets;
            this.sdgsModel[i].indicator = this.form.value.sdgs[i].indicator;
            this.sdgsModel[i].type = 'sdgs';
        }
    }

    if (this.attachmentEnableFiveYearPlan && this.attachmentEnableUpdateFiveYearPlan) {
        for (let i = 0; i < this.rows1.getRawValue().length; i++) {
            this.fiveYearModel[i].goals = this.form1.value.fiveYearPlan[i].goals;
            this.fiveYearModel[i].targets = this.form1.value.fiveYearPlan[i].targets;
            this.fiveYearModel[i].indicator = this.form1.value.fiveYearPlan[i].indicator;
            this.fiveYearModel[i].type = 'fiveYearPlan';
        }
    }

    if (this.attachmentEnablePerspectivePlan && this.attachmentEnableUpdatePerspectivePlan) {
        for (let i = 0; i < this.rows2.getRawValue().length; i++) {
            this.perspectivePlanModel[i].goals = this.form2.value.perspectivePlan[i].goals;
            this.perspectivePlanModel[i].targets = this.form2.value.perspectivePlan[i].targets;
            this.perspectivePlanModel[i].indicator = this.form2.value.perspectivePlan[i].indicator;
            this.perspectivePlanModel[i].type = 'perspectivePlan';
        }
    }

    if (this.attachmentEnableDeltaPlan && this.attachmentEnableUpdateDeltaPlan) {
        for (let i = 0; i < this.rows3.getRawValue().length; i++) {
            this.deltaPlanModel[i].goals = this.form3.value.deltaPlan[i].goals;
            this.deltaPlanModel[i].targets = this.form3.value.deltaPlan[i].targets;
            this.deltaPlanModel[i].indicator = this.form3.value.deltaPlan[i].indicator;
            this.deltaPlanModel[i].type = 'deltaPlan';
        }
    }

    if (this.attachmentEnableClimateChange && this.attachmentEnableUpdateClimateChange) {
        for (let i = 0; i < this.rows4.getRawValue().length; i++) {
            this.climateModel[i].goals = this.form4.value.climateChange[i].goals;
            this.climateModel[i].targets = this.form4.value.climateChange[i].targets;
            this.climateModel[i].indicator = this.form4.value.climateChange[i].indicator;
            this.climateModel[i].type = 'climate';
        }
    }

    if (this.attachmentEnablePoverty && this.attachmentEnableUpdatePoverty) {
        for (let i = 0; i < this.rows5.getRawValue().length; i++) {
            this.povertyModel[i].goals = this.form5.value.povertyChange[i].goals;
            this.povertyModel[i].targets = this.form5.value.povertyChange[i].targets;
            this.povertyModel[i].indicator = this.form5.value.povertyChange[i].indicator;
            this.povertyModel[i].type = 'poverty';
        }
    }

    if (this.attachmentEnableGender && this.attachmentEnableUpdateGender) {
        for (let i = 0; i < this.rows6.getRawValue().length; i++) {
            this.genderModel[i].goals = this.form6.value.genderChange[i].goals;
            this.genderModel[i].targets = this.form6.value.genderChange[i].targets;
            this.genderModel[i].indicator = this.form6.value.genderChange[i].indicator;
            this.genderModel[i].type = 'gender';
        }
    }

    this.linkagesAndTargetService.updateLinkageAndTarget(this.sdgsModel, this.fiveYearModel, this.perspectivePlanModel, this.deltaPlanModel, this.climateModel, this.povertyModel, this.genderModel, this.projectConceptMasterId).subscribe(res => {
        this.snackBar.openSuccessSnackBar();
        this.rows.clear();
        this.rows1.clear();
        this.rows2.clear();
        this.rows3.clear();
        this.rows4.clear();
        this.rows5.clear();
        this.rows6.clear();
        this.addRow();
        this.addRow1();
        this.addRow2();
        this.addRow3();
        this.addRow4();
        this.addRow5();
        this.addRow6();
        this.sdgsModel = [];
        this.fiveYearModel = [];
        this.perspectivePlanModel = [];
        this.deltaPlanModel = [];
        this.climateModel = [];
        this.povertyModel = [];
        this.genderModel = [];
        this.getLinkageAndTargetList();
        if(next) {
            this.nextStep.emit(true);
        } else {
            this.router.navigate([`project-concept`]);
        }
        this.spinner = false;
    }, error => {
        this.snackBar.openErrorSnackBar();
        this.spinner = false;
    });
}

//For open dialog
private openDialog(index: any, type: any, type1: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = ConfirmDialogConstant.WIDTH;
    dialogConfig.height = ConfirmDialogConstant.HEIGHT;
    dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
    dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
    const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
        if (res) {
            if (type === 'deleteFromCurrentRow') {
                if (type1 === 'sdgs'){
                    this.emptyTable(index);
                    dialogRef.close(true);
                }
                if (type1 === 'fiveYearPlan'){
                    this.emptyTable1(index);
                    dialogRef.close(true);
                }
                if (type1 === 'perspectivePlan'){
                    this.emptyTable2(index);
                    dialogRef.close(true);
                }
                if (type1 === 'deltaPlan'){
                    this.emptyTable3(index);
                    dialogRef.close(true);
                }
                if (type1 === 'climate'){
                    this.emptyTable4(index);
                    dialogRef.close(true);
                }
                if (type1 === 'poverty'){
                    this.emptyTable5(index);
                    dialogRef.close(true);
                }
                if (type1 === 'gender'){
                    this.emptyTable6(index);
                    dialogRef.close(true);
                }
            } else if (type === 'deleteFromDB') {
                if(type1 === 'sdgs'){
                    const uuid = this.rows.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'fiveYearPlan'){
                    const uuid = this.rows1.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable1(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'perspectivePlan'){
                    const uuid = this.rows2.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable2(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'deltaPlan'){
                    const uuid = this.rows3.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable3(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'climate'){
                    const uuid = this.rows4.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable4(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'poverty'){
                    const uuid = this.rows5.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable5(index);
                        dialogRef.close(true);
                    }
                }

                if(type1 === 'gender'){
                    const uuid = this.rows6.getRawValue()[index].uuid;
                    if(uuid){
                        this.deleteFromDb(index, type1);
                        dialogRef.close(true);
                    } else {
                        this.emptyTable6(index);
                        dialogRef.close(true);
                    }
                }
            }
        }
        dialogRef.close(true);
    });
}

//Radio button check for sdgs table
sdgsTrueFunction(): any {
    this.isSDGS = true;
}

//Radio button check for sdgs table
sdgsFalseFunction(): any {
    this.isSDGS = false;
    // this.sdgsModel = [];
    //  this.form.reset();
}

//Radio button check for five year plan table
fiveYearTrueFunction(): any {
    this.isFiveYearPlan = true;
}

//Radio button check for five year plan table
fiveYearFalseFunction(): any {
    this.isFiveYearPlan = false;
    // this.fiveYearModel = [];
    //  this.form1.reset();
}

//Radio button check for climate table
climateChangeTrueFunction(): any {
    this.isClimateChange = true;
}

//Radio button check for climate table
climateChangeFalseFunction(): any {
    this.isClimateChange = false;
    //  this.climateModel = [];
    //  this.form4.reset();
}

//Radio button check for poverty table
povertyTrueFunction(): any {
    this.isPovertyChange = true;
}

//Radio button check for poverty table
povertyFalseFunction(): any {
    this.isPovertyChange = false;
    //  this.povertyModel = [];
    //  this.form5.reset();
}

//Radio button check for gender table
genderTrueFunction(): any {
    this.isGenderChange = true;
}

//Radio button check for gender table
genderFalseFunction(): any {
    this.isGenderChange = false;
    // this.genderModel = [];
    //  this.form6.reset();
}

//Radio button check for delta plan table
deltaPlanTrueFunction(): any {
    this.isDeltaPlanChange = true;
}

//Radio button check for delta plan table
deltaPlanFalseFunction(): any {
    this.isDeltaPlanChange = false;
    //  this.deltaPlanModel = [];
    //  this.form3.reset();
}

//Radio button check for perspective plan table
perspectivePlanTrueFunction(): any {
    this.isPerspectivePlanChange = true;
}

//Radio button check for perspective plan table
perspectivePlanFalseFunction(): any {
    this.isPerspectivePlanChange = false;
    //  this.perspectivePlanModel = [];
    //  this.form2.reset();
}

/**
 * For next TAB
 */

nextTab(): void {
    this.nextStep.emit(true);
}

}
