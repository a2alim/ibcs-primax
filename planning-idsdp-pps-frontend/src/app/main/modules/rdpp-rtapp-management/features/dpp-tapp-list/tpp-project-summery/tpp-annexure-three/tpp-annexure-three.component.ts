import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, Validators} from '@angular/forms';
import {DppAnnexureGoods} from '../../../../services/dpp-annexure-goods.service';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../tab-forms/annexure-goods/i18n/en';
import {locale as lngBangla} from '../../tab-forms/annexure-goods/i18n/bn';
import {TppAnnexureThree} from '../../../../models/Tpp-Annexure-three.model';
import { TappConsultantModel } from 'app/main/modules/dpp-tapp-management/models/tapp-consultants.model';
import { BehaviorSubject } from 'rxjs';
import { TappConsultantService } from 'app/main/modules/dpp-tapp-management/services/tapp-consultant.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { ActivatedRoute } from '@angular/router';
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";

@Component({
    selector: 'app-tpp-annexure-three',
    templateUrl: './tpp-annexure-three.component.html',
    styleUrls: ['./tpp-annexure-three.component.scss']
})
export class TppAnnexureThreeComponent implements OnInit {

    count: number = 0;

    spinner: boolean;

    conceptUuid: any;
    uuid: any;
    pcMasterId: number;
    totalAmount: number;
    commencementDate: any;
    completionDate: any;
    projectName: string;
    tappMasterUuid: number;
    data =[];
    tppProjectAnnexureThreeModelList: Array<TppAnnexureThree> = new Array<TppAnnexureThree>();
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    consultantModel: TappConsultantModel[] = new Array<TappConsultantModel>();
    rows: FormArray = this.fb.array([]);
    form = this.fb.group({
        consultantsList: this.rows,
    });

    constructor(private fb: FormBuilder,
                private dppAnnexureGoodsService: DppAnnexureGoods,
                private consultantService: TappConsultantService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,
                private  tappObjectiveCostService: TappObjectiveCostService,
                private projectSummaryService: ProjectSummaryService,
                private route: ActivatedRoute,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptById();
        this.getTappAnnexureThree();

    }

    /*
    ********* Get Project Concept data by using project concept id
     */
    private getProjectConceptById() {
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.pcMasterId = res.id;
                this.projectName = res.titleEn;
                this.totalAmount = res.totalAmount;
                this.commencementDate = res.expCommencementDate;
                this.completionDate = res.expCompletionDate;
                this.getMasterTableData();
            });
    }

    /*
    ********* Add a new Row for table
     */
    addRow(): any {
        const row = this.fb.group({
            uuid: [],
            consultants: ['', Validators.required],
            educationalQualification: ['', Validators.required],
            experience: ['', Validators.required],
            responsibilities: ['', Validators.required],
            projectConceptMasterId: [this.pcMasterId],
            projectConceptUuid: [this.conceptUuid]
        });
        this.consultantsList.push(row);
        this.updateView();
    }

    /*
    ********* Update table data
     */
    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }
    /*
    ********* Get Consultant list
     */
    get consultantsList() {
        return this.form.controls['consultantsList'] as FormArray;
    }

    /*
    ********* Go Back to Project Home Page
     */
    goBackToHome()
    {
       window.history.back();
    }

    /*
    ********* Set data for consultant table
     */
    setDataInStuffmodel(){

        this.consultantModel = [];
        this.rows.getRawValue().forEach(e => {
            this.consultantModel.push(e);
        });
    }

    /*
   ********* For get all Consultant
    */
    getTappAnnexureThree(){
        this.consultantService.getTappAnnexureThree(this.conceptUuid).subscribe((res) => {

            if (res.consultantsList != null) {
                if (res.consultantsList.length > 0) {
                    res.consultantsList.forEach(re => {
                        this.uuid = re.uuid;
                        const row = this.fb.group({
                            uuid: re.uuid,
                            consultants: re.consultants,
                            educationalQualification: re.educationalQualification,
                            experience: re.experience,
                            responsibilities: re.responsibilities,
                            projectConceptMasterId : re.projectConceptMasterId,
                            projectConceptUuid: re.projectConceptUuid
                        });
                        this.rows.push(row);
                        this.updateView();
                        this.tppProjectAnnexureThreeModelList.push(re);
                    });
                } else {
                    const row = this.fb.group({
                        uuid: [],
                        consultants: ['', Validators.required],
                        educationalQualification: ['', Validators.required],
                        experience: ['', Validators.required],
                        responsibilities: ['', Validators.required],
                        projectConceptMasterId: [this.pcMasterId],
                        projectConceptUuid: [this.conceptUuid]
                    });
                    this.rows.push(row);
                    this.data.forEach(() => this.addRow());
                    this.updateView();
                }
            }
        })
    }

    onSubmit(){
        if(this.uuid == null){
            this.saveData()
        }else {
            this.updateData();
        }
    }

    /*
    ********* For Create New Consultant
     */
    saveData(){
        this.spinner = true;
        if(this.tappMasterUuid !=null){
            if(this.form.valid){
                this.setDataInStuffmodel();
                this.consultantService.createConsultant(this.consultantModel).subscribe((res) => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                })
            }else {
                this.snackbarHelper.openErrorSnackBar();
            }
        }else{
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }

    }

    /*
    ********* For Update Consultant
     */
    updateData(){
        this.spinner = true;
        if(this.form.valid){
            this.setDataInStuffmodel();
            this.consultantService.updateConsultant(this.form.value).subscribe((res) => {
                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok")
                this.spinner = false;
            })
        }else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Failed updated data", "Error");
        }
    }

    /*
       ********* For Delete Single Consultant
        */
    private deleteRow(rowIndex){
        let row = this.form.controls['consultantsList'].value[rowIndex]; //const uuid = this.projectManagementModelList[row].uuid;
        if(this.rows.length ===1)
        {
            return false;
        }
        else {
            if(row.uuid){
                this.spinner = true;
                this.consultantService.deleteRow(row.uuid).subscribe((res) => {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(
                        'Deleted Successfully',
                        'Ok'
                    );
                    this.spinner = false;
                    this.rows.removeAt(rowIndex);
                    this.updateView();
                    return true;
                });
            }
            else
            {
                this.rows.removeAt(rowIndex);
                this.updateView();
                return true;

            }
        }
    }

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

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.rows.removeAt(row);
            }
            dialogRef.close(true);
        });
    }

    getMasterTableData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.projectName = res.projectTitleEn ? res.projectTitleEn: this.projectName;
            this.commencementDate = response.res.expCommencementDate ? response.res.expCommencementDate: this.commencementDate;
            this.completionDate = response.res.expCompletionDate ? response.res.expCompletionDate: this.completionDate;
        })
    }
}
