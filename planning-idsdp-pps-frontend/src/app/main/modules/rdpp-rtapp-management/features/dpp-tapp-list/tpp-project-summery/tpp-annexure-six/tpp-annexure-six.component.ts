import {Component, OnInit} from '@angular/core';
import {TppAnnexureThree} from '../../../../models/Tpp-Annexure-three.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../tab-forms/annexure-goods/i18n/en';
import {locale as lngBangla} from '../../tab-forms/annexure-goods/i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {TappQualificationSupportStuffService} from 'app/main/modules/dpp-tapp-management/services/tapp-qualification-support-stuff.service';
import {TappStuffModel} from 'app/main/modules/dpp-tapp-management/models/tapp-support-staff.model';
import {TappSupportStuffModel} from 'app/main/modules/dpp-tapp-management/models/tapp-qualification-support-staff.model';
import {GlobalValidationService} from "../../../../../../../global/validation/global-validation.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import { DppAnnexureGoods } from '../../../../services/dpp-annexure-goods.service';
import {map, startWith} from 'rxjs/operators';
import {IPriorityModel} from "../../../../../configuration-management/models/priority.model";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";

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

    tppProjectAnnexureThreeModelList: Array<TppAnnexureThree> = new Array<TppAnnexureThree>();

    model: TappSupportStuffModel = new TappSupportStuffModel();
    stuffModel: TappStuffModel[] = new Array<TappStuffModel>();
    data = []
    tappMasterUuid;
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.fb.array([]);

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
        this.getSupportStuff();

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
        });
    }

    /*
    ********* Populate Form
     */
    populateForm(){
        const row = this.fb.group({
            designation: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            taskPerformed: ['', Validators.required],
        });
        this.rows.push(row);
        this.data.forEach(() => this.addRow());
        this.updateView();
    }

    /*
    ********* Get Support Stuff List
     */
    get tappSupportStuffList() {
        return this.form.controls['tappSupportStuffList'] as FormArray;
    }

    private getProjectConceptById() {
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {;
                this.projectConceptId = res.id;
                this.projectName = res.titleEn;
                this.getTappMasterData();

            });
    }

    private getTappMasterData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.projectName = res.projectTitleEn ? res.projectTitleEn: this.projectName;
        })
    }

    /*
    ********* Add new row support stuff table
     */
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

    /*
    ********* update support stuff row value
     */
    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }



    /*
    ********* For empty support stuff table
     */
    emptyTable(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }

    /*
    ********* Conditional Save or Update in same time using this method
     */
    onSubmit(){
        if(this.uuid == null){
            this.saveData();
        }else{
            this.updateData();
        }

    }

    /*
    ********* Set data for support stuff table
     */
    setDataInStuffmodel(){

        this.stuffModel = [];
        this.rows.getRawValue().forEach(e => {
            this.stuffModel.push(e);
        });
    }

    /*
    ********* For Create new Support Stuffs
     */
    saveData(){
        this.spinner = true;
        if(this.tappMasterUuid != null){
            if(this.form.valid){
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
            }else{
                this.snackbarHelper.openErrorSnackBar();
            }
        }else{
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }
    }

    /*
    ********* For Update Support Stuffs
     */
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

    /*
    ********* For get Support Stuffs
     */
    getSupportStuff(){
        this.tapp_service.getSupportStuff(this.conceptUuid).subscribe((response) =>{
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
                            projectConceptMasterId: re.projectConceptMasterId
                        });
                        this.rows.push(row);
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

    /*
********* For delete row
 */
    private openDialog(row: any) {
        let rowId = this.form.controls['tappSupportStuffList'].value[row];
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

    /*
********* Go Back to Project Home Page
 */
    goBackToHome()
    {
        window.history.back();
    }

}
