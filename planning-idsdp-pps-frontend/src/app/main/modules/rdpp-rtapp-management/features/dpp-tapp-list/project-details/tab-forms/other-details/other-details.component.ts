import {Component, OnInit} from '@angular/core';

/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectDetailsPartbService} from '../../services/project-details-partb.service';
import {ProjectDetailsPartB} from '../../models/project-details-partb.model';
import {OtherDetails} from '../../models/other-details.model';
import {OtherDetailsService} from '../../services/other-details.service';
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';

/*----/Lng Translation----*/

@Component({
    selector: 'app-other-details',
    templateUrl: './other-details.component.html',
    styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {

    formGroup: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    uuid;
    projectId;
    buttonDisable: boolean;
    dppMasterUuid;
    editor1 = false;
    editor2 = false;
    editor3 = false;
    editor4 = false;
    editor5 = false;
    editor6 = false;
    editor7 = false;
    OtherDetails: OtherDetails = new OtherDetails();
    projectDetailsPartBRequest: ProjectDetailsPartB = new ProjectDetailsPartB();
    content = '';

    spinner: boolean;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private route: ActivatedRoute,
                private router: Router,
                private objectiveAndCostService : DppObjectiveCostService,
                private snackbar: SnackbarHelper,
                private _formBuilder: FormBuilder,
                private utilsService: UtilsService,
                private projectDetailsPartbService: ProjectDetailsPartbService, private otherDetailsService: OtherDetailsService) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
    }

    ngOnInit(): void {
        this.loadFormValue();
        this.getDppMasterUuid();
        this.projectDetailsPartbService.getProjectDetailsPartBuuid().subscribe(uuId => {
            this.projectDetailsPartBRequest.uuid = uuId;
        })

        this.getProjectConceptById();

        this.getOherDetails();
    }

    buttonEnable(){
        if(this.dppMasterUuid == null){
            this.buttonDisable = true;
            }else{
            this.buttonDisable= false;
        }
    }

    /* For getting Master table data */
    getDppMasterUuid(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;

    toggleShow3 = () => this.editor3 = this.editor3 = !this.editor3;

    toggleShow4 = () => this.editor4 = this.editor4 = !this.editor4;

    toggleShow5 = () => this.editor5 = this.editor5 = !this.editor5;

    toggleShow6 = () => this.editor6 = this.editor6 = !this.editor6;

    toggleShow7 = () => this.editor7 = this.editor7 = !this.editor7;

    /* For loading FormValue */
    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            uuid: ['', Validators.required],
            specificationLinkagePerspective: ['', Validators.required],
            contributionProjectAchieving: ['', Validators.required],
            relationProjectAllocation: ['', Validators.required],
            whetherPrivateSector: ['', Validators.required],
            majorConditionalityForeignAid: ['', Validators.required],
            involvementCompensation: ['', Validators.required],
            riskAnalysisMitigation: ['', Validators.required]
        })
    }

    /* For getting ProjectConceptById */
    private getProjectConceptById() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectId = res.uuid;
        });
    }

    /* For saving Other Details */
    save() {
        this.spinner = true;
        this.OtherDetails.specificationLinkagePerspective = this.formGroup.value.specificationLinkagePerspective;
        this.OtherDetails.contributionProjectAchieving = this.formGroup.value.contributionProjectAchieving;
        this.OtherDetails.relationProjectAllocation = this.formGroup.value.relationProjectAllocation;
        this.OtherDetails.whetherPrivateSector = this.formGroup.value.whetherPrivateSector;
        this.OtherDetails.majorConditionalityForeignAid = this.formGroup.value.majorConditionalityForeignAid;
        this.OtherDetails.involvementCompensation = this.formGroup.value.involvementCompensation;
        this.OtherDetails.riskAnalysisMitigation = this.formGroup.value.riskAnalysisMitigation;
        this.OtherDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.OtherDetails.projectConceptUuid = this.conceptUuid;
        this.otherDetailsService.saveOtherDetails(this.OtherDetails).subscribe(res => {
            this.snackbar.openSuccessSnackBar();
            this.spinner = false;
        })
    }

    /* For saving Other Details */
    saveAndExit() {
        this.spinner = true;
        this.OtherDetails.specificationLinkagePerspective = this.formGroup.value.specificationLinkagePerspective;
        this.OtherDetails.contributionProjectAchieving = this.formGroup.value.contributionProjectAchieving;
        this.OtherDetails.relationProjectAllocation = this.formGroup.value.relationProjectAllocation;
        this.OtherDetails.whetherPrivateSector = this.formGroup.value.whetherPrivateSector;
        this.OtherDetails.majorConditionalityForeignAid = this.formGroup.value.majorConditionalityForeignAid;
        this.OtherDetails.involvementCompensation = this.formGroup.value.involvementCompensation;
        this.OtherDetails.riskAnalysisMitigation = this.formGroup.value.riskAnalysisMitigation;
        this.OtherDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.OtherDetails.projectConceptUuid = this.conceptUuid;
        this.otherDetailsService.saveOtherDetails(this.OtherDetails).subscribe(res => {
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackbar.openSuccessSnackBar();
        })
    }

    /* For setting OtherDetails*/
    setOtherDetails(res: any) {
        this.formGroup.patchValue({
            uuid: res.uuid,
            specificationLinkagePerspective: res.specificationLinkagePerspective,
            contributionProjectAchieving: res.contributionProjectAchieving,
            relationProjectAllocation: res.relationProjectAllocation,
            whetherPrivateSector: res.whetherPrivateSector,
            majorConditionalityForeignAid: res.majorConditionalityForeignAid,
            involvementCompensation: res.involvementCompensation,
            riskAnalysisMitigation: res.riskAnalysisMitigation,
            projectId: res.projectId,
        });
    }

    /* For getting OtherDetails*/
    getOherDetails() {
        this.otherDetailsService.getOtherDetails(this.conceptUuid).subscribe((res) => {
            this.uuid = res.uuid;
            this.setOtherDetails(res);
        })
    }

    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.updateOtherDetails();
        }
    }

    onSubmitAndExit() {
        if (this.uuid == null) {
            this.saveAndExit();
        } else {
            this.updateAndExit();
        }
    }

    /* For updating Other Details */
    updateOtherDetails() {
        this.spinner = true;
        this.OtherDetails.specificationLinkagePerspective = this.formGroup.value.specificationLinkagePerspective;
        this.OtherDetails.contributionProjectAchieving = this.formGroup.value.contributionProjectAchieving;
        this.OtherDetails.relationProjectAllocation = this.formGroup.value.relationProjectAllocation;
        this.OtherDetails.whetherPrivateSector = this.formGroup.value.whetherPrivateSector;
        this.OtherDetails.majorConditionalityForeignAid = this.formGroup.value.majorConditionalityForeignAid;
        this.OtherDetails.involvementCompensation = this.formGroup.value.involvementCompensation;
        this.OtherDetails.riskAnalysisMitigation = this.formGroup.value.riskAnalysisMitigation;
        this.OtherDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.OtherDetails.projectConceptUuid = this.conceptUuid;
        this.otherDetailsService.updateOtherDetails(this.OtherDetails, this.conceptUuid).subscribe((res) => {
            this.spinner = false;
            this.snackbar.openSuccessSnackBarWithMessage("Succussfully Update Data", "Ok");

        })
    }

    /* For updating Other Details */
    updateAndExit() {
        this.spinner = true;
        this.OtherDetails.specificationLinkagePerspective = this.formGroup.value.specificationLinkagePerspective;
        this.OtherDetails.contributionProjectAchieving = this.formGroup.value.contributionProjectAchieving;
        this.OtherDetails.relationProjectAllocation = this.formGroup.value.relationProjectAllocation;
        this.OtherDetails.whetherPrivateSector = this.formGroup.value.whetherPrivateSector;
        this.OtherDetails.majorConditionalityForeignAid = this.formGroup.value.majorConditionalityForeignAid;
        this.OtherDetails.involvementCompensation = this.formGroup.value.involvementCompensation;
        this.OtherDetails.riskAnalysisMitigation = this.formGroup.value.riskAnalysisMitigation;
        this.OtherDetails.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this.OtherDetails.projectConceptUuid = this.conceptUuid;
        this.otherDetailsService.updateOtherDetails(this.OtherDetails, this.conceptUuid).subscribe((res) => {
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackbar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");

        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }
	

}
