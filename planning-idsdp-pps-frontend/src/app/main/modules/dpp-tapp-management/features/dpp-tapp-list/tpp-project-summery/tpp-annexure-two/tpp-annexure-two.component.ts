import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { TermOfReferenceModel } from 'app/main/modules/dpp-tapp-management/models/tapp-term-of-reference.model';
import { TermOfReferenceService } from 'app/main/modules/dpp-tapp-management/services/tapp-term-of-reference.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ActivatedRoute } from '@angular/router';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { ThisReceiver } from '@angular/compiler';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';
import {MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
import {TappAnnexureGoodsService} from "../../../../services/tapp-annexure/tapp-annexure-goods.service";
import {SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN} from "../../../../../../core/constants/message";

@Component({
    selector: 'app-tpp-annexure-two',
    templateUrl: './tpp-annexure-two.component.html',
    styleUrls: ['./tpp-annexure-two.component.scss']
})
export class TppAnnexureTwoComponent implements OnInit {


    institutionalAgreement: string;

    conceptUuid: string;

    frmGroup: FormGroup;
    refUuid: string;
    tappMasterUuid: string;
    pc_masterId: number;
    totalAmount: number;
    commencementDate: any;
    completionDate: any;
    projectName: string;

    id: any;

    spinner: boolean;

    minEditorConfig: any = MIN_EDITOR_CONFIG;

    model: TermOfReferenceModel = new TermOfReferenceModel;
    isParipatra2016: boolean = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: TermOfReferenceService,
        private formBuilder: FormBuilder,
        private sanckbarHelper: SnackbarHelper,
        private route: ActivatedRoute,
        private  tappObjectiveCostService: TappObjectiveCostService,
        private projectSummaryService: ProjectSummaryService,
        private utilsService: UtilsService,
        private dialog: MatDialog,
        private tappAnnexureGoodsService : TappAnnexureGoodsService) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }
    ngOnInit(): void {
        this.frmGroup = this.formBuilder.group({
            institutionalAgreement: ['', Validators.required]
        })

        // Get Project Concept ID from parameter
        this.conceptUuid = this.route.snapshot.params['id'];
        this.getProjectConceptById();
        this.getReference();
    }

    /*
     ********* For get Reference by using project concept id
     */
    getReference(){
        this.service.getReference(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.refUuid = res.uuid;
            this.setTermOfRef(res);
        })
    }

    /*
     ********* Conditional Save or Update in a same time using this method
     */
    onSubmit(){
        if(this.refUuid == null){
            this.saveData();
        }
        else{
            this.updateReference();
        }
    }

    /*
     ********* Go back to Project Home page
     */
    goBackToHome()
    {
       window.history.back();
    }


    /*
     ********* For Create Term of Reference
     */
    saveData() {
        this.spinner = true;
        if(this.tappMasterUuid != null){
            if(this.frmGroup.valid){
                this.model.institutionalAgreement = this.frmGroup.value.institutionalAgreement;
                this.model.projectConceptUuid = this.conceptUuid;
                this.model.projectConceptMasterId = this.pc_masterId;
                this.service.createReference(this.model).subscribe((res) => {
                    if(this.pc_masterId != null){
                        this.sanckbarHelper.openSuccessSnackBar();
                        this.getReference();
                    }else {
                        this.sanckbarHelper.openErrorSnackBar();
                    }
                    this.spinner = false;
                })
            }else{
                this.sanckbarHelper.openErrorSnackBarWithMessage("Value is Required", "Error");
            }
        }else {
            this.sanckbarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }
    }



    /*
     ********* For Update Term of Reference
     */
    updateReference(){
        this.spinner = true;
        if(this.frmGroup.valid){
            this.model.institutionalAgreement = this.frmGroup.value.institutionalAgreement;
            this.model.projectConceptUuid = this.conceptUuid;
            this.model.projectConceptMasterId = this.pc_masterId;
            this.service.updateReference(this.model, this.conceptUuid).subscribe((res) => {
                if(this.pc_masterId != null){
                    this.sanckbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED , SUCCESSFULLY_UPDATED_BN);
                    this.getReference();
                }else {
                    this.sanckbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            })
        }else{
            this.sanckbarHelper.openErrorSnackBarWithMessage("Value is Required", "Error");
        }
    }

    /*
     ********* For Set Term of Reference
     */
    setTermOfRef(res: any){
        this.frmGroup.patchValue({
            institutionalAgreement : res.institutionalAgreement
        });
    }

    /*
     ********* Get Term of Rererence by using project concept id
     */
    gettermofRef(){
        this.service.getByUuid(this.conceptUuid).subscribe((res) => {
            this.setTermOfRef(res);
        })

    }

    /*
     ********* Get project Concept data by using project concept id
     */
    private getProjectConceptById() {
            this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
                console.log('project concept data');
                console.log(res);
                if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                    this.isParipatra2016 = true;
                } else {
                    this.isParipatra2016 = false;
                }
                this.pc_masterId = res.id;
                this.projectName = res.isForeignAid ? res.titleEn : res.titleBn;
                this.commencementDate = res.expCommencementDate;
                this.completionDate = res.expCompletionDate;
                this.getMasterTableData();
                this.getTotalAmount(res.id);
            })
    }

    getMasterTableData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.projectName = res.projectTitleEn ? res.projectTitleEn: this.projectName;
            this.commencementDate = res.expCommencementDate;
            this.completionDate = res.expCompletionDate;

        })
    }

    private getTotalAmount(pcId) {
        this.tappAnnexureGoodsService.getTappAnnexure5bData(pcId).subscribe((res) => {
            let grandTotal = res.filter(f => f.componentName === "Grand_Total")[0].tappAnnualPhasingCostTotal[0];
            this.totalAmount = grandTotal.totalAmount;
        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }


}
