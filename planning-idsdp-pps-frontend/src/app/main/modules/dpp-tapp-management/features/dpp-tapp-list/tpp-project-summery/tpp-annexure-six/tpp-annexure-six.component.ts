import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {TappQualificationSupportStuffService} from 'app/main/modules/dpp-tapp-management/services/tapp-qualification-support-stuff.service';
import {TappStuffModel} from 'app/main/modules/dpp-tapp-management/models/tapp-support-staff.model';
import {TappSupportStuffModel} from 'app/main/modules/dpp-tapp-management/models/tapp-qualification-support-staff.model';
import {GlobalValidationService} from "../../../../../../../global/validation/global-validation.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-tpp-annexure-six',
    templateUrl: './tpp-annexure-six.component.html',
    styleUrls: ['./tpp-annexure-six.component.scss']
})
export class TppAnnexureSixComponent implements OnInit {

    count: number = 0;
    form: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    projectConceptId: number;
    uuid: string;
    projectName: string;
    spinner: boolean;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    model: TappSupportStuffModel = new TappSupportStuffModel();
    stuffModel: TappStuffModel[] = new Array<TappStuffModel>();
    data = []
    tappMasterUuid;
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.fb.array([]);
    gobRows: FormArray = this.fb.array([]);
    rpaRows: FormArray = this.fb.array([]);
    dpaRows: FormArray = this.fb.array([]);
    othersRows: FormArray = this.fb.array([]);
    isParipatra2016: boolean = true;
    isForeignAid: boolean;

    gobArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    rpaArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    dpaArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];

    othersArr: {
        designation,
        educationalQualification,
        experience,
        taskPerformed,
        projectConceptMasterId,
        remarks,
        type
    }[] = [];


    constructor(private fb: FormBuilder,
        private tapp_service: TappQualificationSupportStuffService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,
                private router: Router,
                private  tappObjectiveCostService: TappObjectiveCostService,
                private validation : GlobalValidationService,
                private route: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.loadForm();
        this.getProjectConceptById();
    }

    loadForm(){
        this.form = this.fb.group({
            projectConceptUuid: [],
            projectConceptId: [],
            gobFund: ['0',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            rpaFund: ['0',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            dpaFund: ['0',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            others: ['0',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            tappSupportStuffList: this.rows,
            gobSupportStuffList: this.gobRows,
            rpaSupportStuffList: this.rpaRows,
            dpaSupportStuffList: this.dpaRows,
            othersSupportStuffList: this.othersRows,
        });
    }

    get tappSupportStuffList() {
        return this.form.controls['tappSupportStuffList'] as FormArray;
    }

    get gobSupportStuffList() {
        return this.form.controls['gobSupportStuffList'] as FormArray;
    }

    get rpaSupportStuffList() {
        return this.form.controls['rpaSupportStuffList'] as FormArray;
    }

    get dpaSupportStuffList() {
        return this.form.controls['dpaSupportStuffList'] as FormArray;
    }

    get othersSupportStuffList() {
        return this.form.controls['othersSupportStuffList'] as FormArray;
    }

    private getProjectConceptById() {
        this.spinner = true;
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {;
            this.projectConceptId = res.id;
            this.projectName = res.titleEn;
            this.getTappMasterData();
            this.isParipatra2016 = res.isParipatra2016;
            this.getSupportStuff();
            this.spinner = false;
            this.isForeignAid = res.isForeignAid;
        });
    }

    private getTappMasterData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.projectName = res.projectTitleEn ? res.projectTitleEn: this.projectName;
        })
    }

    addRow(): any {
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
            projectConceptMasterId: [this.projectConceptId]
        });
        this.rows.push(row);
        this.updateView();
    }

    addGobRow(): any {
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
            projectConceptMasterId: [this.projectConceptId],
            remarks: ['', Validators.required],
            type: ['GOB'],
        });
        this.gobRows.push(row);
        this.dataSource.next(this.gobRows.controls);
    }

    addRpaRow(): any {
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
            projectConceptMasterId: [this.projectConceptId],
            remarks: ['', Validators.required],
            type: ['RPA'],
        });
        this.rpaRows.push(row);
        this.dataSource.next(this.rpaRows.controls);
    }

    addDpaRow(): any {
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
            projectConceptMasterId: [this.projectConceptId],
            remarks: ['', Validators.required],
            type: ['DPA'],
        });
        this.dpaRows.push(row);
        this.dataSource.next(this.dpaRows.controls);
    }

    addOthersRow(): any {
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
            projectConceptMasterId: [this.projectConceptId],
            remarks: ['', Validators.required],
            type: ['Others'],
        });
        this.othersRows.push(row);
        this.dataSource.next(this.othersRows.controls);
    }

    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }

    emptyTable(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }

    emptyTable2022(type, index): any {
        if(type === "GOB") {
            if (this.gobRows.length === 0) {
                return false;
            } else {
                this.gobRows.removeAt(index);
                this.dataSource.next(this.gobRows.controls);
                return true;
            }
        } else if(type === "RPA") {
            if (this.rpaRows.length === 0) {
                return false;
            } else {
                this.rpaRows.removeAt(index);
                this.dataSource.next(this.rpaRows.controls);
                return true;
            }
        } else if(type === "DPA") {
            if (this.dpaRows.length === 0) {
                return false;
            } else {
                this.dpaRows.removeAt(index);
                this.dataSource.next(this.dpaRows.controls);
                return true;
            }
        } else if(type === "Others") {
            if (this.othersRows.length === 0) {
                return false;
            } else {
                this.othersRows.removeAt(index);
                this.dataSource.next(this.othersRows.controls);
                return true;
            }
        }
    }

    onSubmit() {
        if(this.uuid == null){
            this.saveData();
        }else{
            this.updateData();
        }
    }

    setDataInStuffmodel(){
        this.stuffModel = [];
        this.rows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
        this.gobRows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
        this.rpaRows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
        this.dpaRows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
        this.othersRows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
    }

    saveData() {
        this.spinner = true;
        if(this.tappMasterUuid != null) {
            if(this.form.valid) {
                this.setDataInStuffmodel();
                this.model.gobFund = this.form.value.gobFund;
                this.model.rpaFund = this.form.value.rpaFund;
                this.model.dpaFund = this.form.value.dpaFund;
                this.model.others = this.form.value.others;
                this.model.projectConceptId = this.projectConceptId;
                this.model.projectConceptUuid = this.conceptUuid;
                this.tapp_service.createSupportStuff(this.model, this.stuffModel).subscribe((res) => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                },err=>{
                    this.spinner = false;;
                })
            } else {
                this.snackbarHelper.openErrorSnackBar();
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }
    }

    updateData(){
        this.spinner = true;
        if(this.form.valid){
            this.setDataInStuffmodel();
            this.model.gobFund = this.form.value.gobFund;
            this.model.rpaFund = this.form.value.rpaFund;
            this.model.dpaFund = this.form.value.dpaFund;
            this.model.others = this.form.value.others;
            this.model.projectConceptId = this.projectConceptId;
            this.model.projectConceptUuid = this.conceptUuid;
            this.tapp_service.update(this.model, this.stuffModel, this.conceptUuid).subscribe((res) => {
                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Update Data", "Ok");
                this.spinner = false;
            },err=>{
                this.spinner = false;
            })
        }else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Failed to updated data", "Error");
        }
    }

    getSupportStuff(){
        this.tapp_service.getSupportStuff(this.conceptUuid).subscribe((response) =>{
            console.log('tappSupportStuffList',response);
            let res = response.res;
            this.setSupprotStuff(res);
            this.uuid = res.uuid;
            if (res.tappSupportStuffList != null) {
                if (res.tappSupportStuffList.length > 0) {
                    res.tappSupportStuffList.forEach(re => {
                        const row = this.fb.group({
                            designation: re.designation,
                            educationalQualification: re.educationalQualification,
                            experience: re.experience,
                            taskPerformed: re.taskPerformed,
                            projectConceptMasterId: re.projectConceptMasterId,
                            remarks: re.remarks,
                            type: re.type
                        });
                        if (this.isParipatra2016) {
                            this.rows.push(row);
                        } else if(re.type === "GOB") {
                            this.gobRows.push(row);
                        } else if(re.type === "RPA") {
                            this.rpaRows.push(row);
                        } else if(re.type === "DPA") {
                            this.dpaRows.push(row);
                        } else if(re.type === "Others") {
                            this.othersRows.push(row);
                        }
                    })
                }
            }
        })
    }

    setSupprotStuff(res: any){
        this.form.patchValue({
            gobFund: res.gobFund,
            rpaFund: res.rpaFund,
            dpaFund: res.dpaFund,
            others: res.others,
        })
    }

    private openDialog(row: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        this.spinner = true;
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.emptyTable(row);
            }
            dialogRef.close(true);
            this.spinner = false;
        });
    }

    private openDialog2022(type: any, row: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        this.spinner = true;
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.emptyTable2022(type, row);
            }
            dialogRef.close(true);
            this.spinner = false;
        });
    }

    goBackToHome() {
        window.history.back();
    }
}
