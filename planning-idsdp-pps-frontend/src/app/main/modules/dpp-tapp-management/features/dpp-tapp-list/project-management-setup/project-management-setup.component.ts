import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ERROR,
    FAILED_DELETE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN, SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN
} from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { BehaviorSubject } from 'rxjs';
import { ProjectManagementModel } from '../../../models/project-management.model';
import { DppProjectManagementSetupService } from '../../../services/dpp-project-management-setup.service';
import {GlobalValidationService} from "../../../../../../global/validation/global-validation.service";
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {TranslateService} from "@ngx-translate/core";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {AgencyService} from "../../../../configuration-management/services/agency.service";

@Component({
    selector: 'app-project-management-setup',
    templateUrl: './project-management-setup.component.html',
    styleUrls: ['./project-management-setup.component.scss']
})
export class ProjectManagementSetupComponent implements OnInit {
    count: number = 0;
    projectConceptUuid: any;
    projectConceptId: number;
    conceptUuid = this.route.snapshot.params['id'];
    count2: number = 0;
    count3: number = 0;
    existingUuid: [];
    executionUuid: [];
    outsourcingUuid: [];
    dppMasterUuid;
    canUpdate: boolean;
    buttonDisable: boolean;
    dataSource1 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource2 = new BehaviorSubject<AbstractControl[]>([]);
    dataSource3 = new BehaviorSubject<AbstractControl[]>([]);
    projectManagementModelList: Array<ProjectManagementModel> = new Array<ProjectManagementModel>();
    projectManagementModelList2: Array<ProjectManagementModel> = new Array<ProjectManagementModel>();
    projectManagementModelList3: Array<ProjectManagementModel> = new Array<ProjectManagementModel>();
    data: [];
    file: File;
    isAttachmentEnable: boolean;
    attachmentId: number;
    attachmentName: any;
    titleEn: any;

    rows: FormArray = this.fb.array([]);
    rows1: FormArray = this.fb.array([]);
    rows2: FormArray = this.fb.array([]);
    form = this.fb.group({
        attachmentId: '',
        pcUuid: '',
        existingSetup: this.rows,
        executionSetup: this.rows1,
        outSourcing: this.rows2,
    });

    spinner: boolean;
    paripatraVersion: any;
    projectsSummary: any;
    isParipatra2016: boolean;
    projectSummary: IProjectConcept;
    agencyModel: any;
    private conceptId: number;
    private subscribe$: any;
    private locationWiseCost: any;

    constructor(
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private objectiveAndCostService : DppObjectiveCostService,
        private sanckBarHelper: SnackbarHelper,
        private validation : GlobalValidationService,
        private route: ActivatedRoute,
        private projectSummaryService: ProjectSummaryService,
        private dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: DppProjectManagementSetupService,
        private fileUploadService: FileUploadService,
        private _translateService: TranslateService,
        private agencyService: AgencyService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getDppMasterUuid();
        this.getProjectConceptById();
        this.getProjectManagementSetup();
        this.getProjectMannagementOrganogramAttachment();
    }

    /* For getting Master table data */
    getDppMasterUuid(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    buttonEnable(){
        if(this.dppMasterUuid == null){
            this.buttonDisable = true;
            this.sanckBarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }else{
            this.buttonDisable= false;
        }
    }

    /*
     ********* Back to project home page by this method
     */
    goBackToHome()
    {
       window.history.back();
    }

    /*
     ********* Conditional Save or Update in a same time using this method
     */
    onSubmit() {
        if (this.existingUuid ==null && this.executionUuid ==null && this.outsourcingUuid ==null){
            this.saveData();
        }else {
            this.updateData();
        }
    }

    /*
     ********* for get project concept data by using project concept id
     */
    private getProjectConceptById() {

            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                this.projectsSummary = res;
                console.log('this.projectSummary', res);
                this.projectConceptUuid = res.uuid;
                this.projectConceptId = res.id;
                this.titleEn = res.titleEn;
                if (res.isForeignAid) {
                    this._translateService.use('en');
                } else {
                    this._translateService.use('bn');
                }

                this.paripatraVersion = res.paripatraVersion.nameEn;
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }
                this.getAgency();
            });
    }
    private getAgency() {
        this.agencyService.getById(this.projectsSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }
    /**
     * for update project management setup
     */
    updateData(){
        this.spinner = true;
        if(this.form.valid){
            this.service.updateprojectManagementSetup(this.form.value).subscribe((res) =>{
                this.sanckBarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
                // this.goBackToHome();
                this.rows.clear();
                this.rows1.clear();
                this.rows2.clear();
                this.getProjectManagementSetup();
                // this.getProjectMannagementOrganogramAttachment();
                this.spinner = false;
            })
        }else {
            this.sanckBarHelper.openErrorSnackBar();
            this.spinner = false;
        }

    }
    /*
     ********* For save project management setup
     */
    saveData() {
        this.spinner = true;
        if(this.form.valid){
            this.service.createProjectSetup(this.form.value).subscribe((response) => {
                this.sanckBarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
                this.rows.clear();
                this.rows1.clear();
                this.rows2.clear();
                this.getProjectManagementSetup();
                // this.getProjectMannagementOrganogramAttachment();
                // this.goBackToHome();
                this.spinner = false;
            })
        }else{
            this.sanckBarHelper.openErrorSnackBar();
            this.spinner = false;
        }

    }

    /*
     ********* Add new row for existing table
     */
    addRow() {
        const row = this.fb.group({
            uuid : null,
            nameOfThePost: ['', Validators.required],
            quantity: ['',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            qualification: ['', Validators.required],
            modeOfRecruitment: ['', Validators.required],
            scale_amount: ['', Validators.required],
            payGrade: ['', Validators.required],
            responsibility: ['', Validators.required],
            remarks: ['', ],
            projectConceptUuid:[this.conceptUuid,],
            projectConceptId:[this.projectConceptId,],
        });
        this.existingSetup.push(row);
    }
    /*
     ********* Add new row for execution table
     */
    addRow1() {
        const row = this.fb.group({
            nameOfThePost: ['', Validators.required],
            quantity: ['',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            qualification: ['', Validators.required],
            modeOfRecruitment: ['', Validators.required],
            scale_amount: ['',Validators.required],
            payGrade: ['', Validators.required],
            responsibility: ['', Validators.required],
            remarks: ['', ],
            projectConceptUuid:[this.conceptUuid],
            projectConceptId:[this.projectConceptId,],
        });
        this.executionSetup.push(row);
        // console.log('this.form', this.form.value);
    }
    /*
     ********* Add new row for outsourcing table
     */
    addRow2() {
        const row = this.fb.group({
            nameOfThePost: ['', Validators.required],
            quantity: ['',
                [
                    Validators.required,
                    this.validation.decimalNumber('this'),
                    this.validation.checkString('this')
                ]
            ],
            qualification: ['', Validators.required],
            modeOfRecruitment: ['', Validators.required],
            scale_amount: ['',Validators.required],
            payGrade: ['', Validators.required],
            responsibility: ['', Validators.required],
            remarks: ['', ],
            projectConceptUuid:[this.conceptUuid],
            projectConceptId:[this.projectConceptId,],
        });
        this.outSourcing.push(row);
        // console.log('this.form', this.form.value);
    }
    /*
     ********* For udpate row existing table
     */
    updateView(): any {
        this.dataSource1.next(this.rows.controls);
    }

    /*
     ********* For udpate execution table
     */
    updateView1(): any {
        this.dataSource2.next(this.rows.controls);
    }

    /*
     ********* For udpate row outsourcing table
     */
    updateView2(): any {
        this.dataSource3.next(this.rows.controls);
    }


    delete(rowIndex) {
        this.spinner = true;
        let rowId = this.form.controls['existingSetup'].value[rowIndex];

        if (this.rows.length === 1) {
            return false;
        }
        else
        {
            if(rowId.id > 0)
            {
                this.service.deleteProjectSetup(rowId.id).subscribe((res) => {
                    if(res.status == 1)
                    {
                        this.sanckBarHelper.openSuccessSnackBarWithMessage(
                            'Deleted Successfully',
                            'Ok'
                        );
                        this.rows.removeAt(rowIndex);
                        this.updateView();
                        return true;
                    }
                    this.spinner = false;
                });
            }
            else
            {
                this.rows.removeAt(rowIndex);
                this.updateView();
                return true;

            }
            this.spinner = false;
        }

    }
    /*
     ********* Delete row to for database
     */
    deleteFromDb(row: any, type: any){

        if (type === 'existing'){
            this.spinner = true;
            const uuid = this.projectManagementModelList[row]['uuid'];
            this.service.deleteProjectSetup(uuid).subscribe(res => {

                if (res.uuid != null) {
                    this.sanckBarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getProjectManagementSetup();
                } else {
                    this.sanckBarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
                this.spinner = false;
            });
        }

        if (type === 'execution'){
            this.spinner = true;
            const uuid = this.projectManagementModelList2[row]['uuid'];
            this.service.deleteProjectSetup(uuid).subscribe(res => {
                if (res) {
                    this.sanckBarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getProjectManagementSetup();
                } else {
                    this.sanckBarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
                this.spinner = false;
            });
        }

        if (type === 'outsourcing'){
            this.spinner = true;
            const uuid = this.projectManagementModelList3[row]['uuid'];
            this.service.deleteProjectSetup(uuid).subscribe(res => {
                if (res) {
                    this.sanckBarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getProjectManagementSetup();
                } else {
                    this.sanckBarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
                this.spinner = false;
            });
        }
    }


    getProjectMannagementOrganogramAttachment() {
       this.service.getProjectMannagementOrganogramAttachment(this.conceptUuid).subscribe((response) =>{
           // console.log(response);
           if(response.status === 200) {
               this.isAttachmentEnable = true;
               this.attachmentId = response.res.attachment.id;
               this.form.value.attachmentId = response.res.attachment.id;
               this.attachmentName = response.res.attachment.name;
           } else if(response.status === 404) {
               this.isAttachmentEnable = false;
               this.attachmentId = null;
               this.form.value.attachmentId = '';
           }
       });
    }

    /*
     ********* Get all Project Management data by project id;
     */
    getProjectManagementSetup(){
        this.service.getProjectManagementSetup(this.conceptUuid).subscribe((response) =>{
            // console.log(response);
            this.rows.clear;
            this.rows1.clear;
            this.rows2.clear;
            let res = response.res;
            if (res.existingSetup != null || res.executionSetup != null || res.outSourcing != null){
                if (res.existingSetup.length > 0){
                     res.existingSetup.forEach(re => {
                         this.existingUuid = re.uuid;
                         const row = this.fb.group({
                            uuid: re.uuid,
                            nameOfThePost: re.nameOfThePost,
                            quantity: re.quantity,
                            qualification: re.qualification,
                            modeOfRecruitment: re.modeOfRecruitment,
                            scale_amount: re.scale_amount,
                            payGrade: re.payGrade,
                            responsibility: re.responsibility,
                            remarks: re.remarks,
                            types: re.types,
                             projectConceptUuid:re.projectConceptUuid,
                             projectConceptId:re.projectConceptId
                         });
                         this.rows.push(row);
                         this.updateView();
                         this.canUpdate = true;
                         // this.canUpdateLinkage = true;
                         this.projectManagementModelList.push(re);
                     });
                 }

                 if (res.executionSetup.length > 0){
                    res.executionSetup.forEach(re => {
                        this.executionUuid = re.uuid;
                        const row = this.fb.group({
                            uuid: re.uuid,
                           nameOfThePost: re.nameOfThePost,
                           quantity: re.quantity,
                           qualification: re.qualification,
                           modeOfRecruitment: re.modeOfRecruitment,
                           scale_amount: re.scale_amount,
                           payGrade: re.payGrade,
                           responsibility: re.responsibility,
                           remarks: re.remarks,
                           types: re.types,
                            projectConceptUuid:re.projectConceptUuid,
                            projectConceptId:re.projectConceptId
                        });
                        this.rows1.push(row);
                        this.updateView1();
                        this.canUpdate = true;
                        // this.canUpdateLinkage = true;
                        this.projectManagementModelList2.push(re);
                    });
                }

                if (res.outSourcing.length > 0){
                    res.outSourcing.forEach(re => {
                        this.outsourcingUuid = re.uuid;
                        const row = this.fb.group({
                            uuid: re.uuid,
                           nameOfThePost: re.nameOfThePost,
                           quantity: re.quantity,
                           qualification: re.qualification,
                           modeOfRecruitment: re.modeOfRecruitment,
                           scale_amount: re.scale_amount,
                           payGrade: re.payGrade,
                           responsibility: re.responsibility,
                           remarks: re.remarks,
                           types: re.types,
                            projectConceptUuid:re.projectConceptUuid,
                            projectConceptId:re.projectConceptId,
                        });
                        this.rows2.push(row);
                        this.updateView2();
                        this.canUpdate = true;
                        // this.canUpdateLinkage = true;
                        this.projectManagementModelList3.push(re);
                    });
                }
                }
        })
    }


    /*
     ********* For get existing form array
     */
    get existingSetup() {
        return this.form.controls['existingSetup'] as FormArray;
    }
    /*
     ********* For get execution form array
     */
    get executionSetup() {
        return this.form.controls['executionSetup'] as FormArray;
    }
    /*
     ********* For get Oursourcing form array
     */
    get outSourcing() {
        return this.form.controls['outSourcing'] as FormArray;
    }

    /*
     ******* Open dialog box for delete confirmation
     */
    private deleteRow(rowIndex){
        let row = this.form.controls['existingSetup'].value[rowIndex];

        if(this.rows.length ===1)
        {
            return false;
        }
        else {
            if(row.uuid){
                this.spinner = true;
                this.service.deleteRow(row.uuid).subscribe((res) => {
                        this.sanckBarHelper.openSuccessSnackBarWithMessage(
                            'Deleted Successfully',
                            'Ok'
                        );
                        this.rows.removeAt(rowIndex);
                        this.updateView();
                        return true;
                        this.spinner = false;
                });
                this.spinner = false;
            }
            else
            {
                this.rows.removeAt(rowIndex);
                this.updateView();
                return true;

            }
        }
    }

    private deleteRow2(rowIndex){
        let row = this.form.controls['executionSetup'].value[rowIndex];

        if(this.rows1.length ===1)
        {
            return false;
        }
        else {

            if(row.uuid){
                this.spinner = true;
                this.service.deleteRow(row.uuid).subscribe((res) => {
                    this.sanckBarHelper.openSuccessSnackBarWithMessage(
                        'Deleted Successfully',
                        'Ok'
                    );
                    this.rows1.removeAt(rowIndex);
                    this.updateView1();
                    return true;
                    this.spinner = false;
                });
                this.spinner = false;
            }
            else
            {
                this.rows1.removeAt(rowIndex);
                this.updateView1();
                return true;

            }
        }
    }

    private deleteRow3(rowIndex){
        let row = this.form.controls['outSourcing'].value[rowIndex];

        if(this.rows2.length ===1)
        {
            return false;
        }
        else {
            if(row.uuid){
                this.spinner = true;
                this.service.deleteRow(row.uuid).subscribe((res) => {
                    this.sanckBarHelper.openSuccessSnackBarWithMessage(
                        'Deleted Successfully',
                        'Ok'
                    );
                    this.rows2.removeAt(rowIndex);
                    this.updateView2();
                    return true;
                    this.spinner = false;
                });
                this.spinner = false;
            }
            else
            {
                this.rows2.removeAt(rowIndex);
                this.updateView2();
                return true;

            }
        }
    }

    private openDialog(index: any, type: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteFromDb(index, type);

                } else {
                    dialogRef.close(true);
                }
            dialogRef.close(true);
        });
    }


    /*
   upload Attachment
    */

    uploadFile(file: FileList): any {
        this.spinner = true;
        this.file = file.item(0);
        this.fileUploadService.uploadFileDppService(this.file).subscribe(res => {
            if(res.id) {
                this.sanckBarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
                this.form.value.attachmentId = res.id;
                this.form.value.pcUuid = this.conceptUuid;
                this.isAttachmentEnable = true;
                this.attachmentId = res.id;
            }
            this.spinner = false;
        }, error => {
            // console.log(error);
            this.sanckBarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
            this.spinner = false;
        });
    }

    /*
    download Attachment
     */
    download() {
        this.spinner = true;
        this.fileUploadService.getAttachmentByIdInDppService(this.attachmentId).subscribe(res => {
            this.fileUploadService.downloadAttachmentInDppService(res.pathUrl);
            this.spinner = false;
        });
    }

    deleteAttachment() {
        this.spinner = true;
        this.fileUploadService.deleteByIdDpp(this.attachmentId).subscribe(res => {
            this.isAttachmentEnable = false;
            this.attachmentId = null;
            this.spinner = false;
            this.attachmentName = '';
            this.form.patchValue({attachmentId:null});
        });
    }

}
