import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

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
import {UtilsService} from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";
import {
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../../../core/constants/message";
import {TranslateService} from "@ngx-translate/core";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";

/*----/Lng Translation----*/

@Component({
    selector: 'app-other-details',
    templateUrl: './other-details.component.html',
    styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
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
    indicatorList: any = [];
    urlList: any = [];
    projectTitleEn: any;
    projectTitleBn: any;

    titleEn: string;
    paripatraVersion: any;
    isParipatra2016: boolean;
    projectSummary: IProjectConcept;
    isEnProject: boolean;

    isPrivateSector: boolean | null = null;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectSummaryService: ProjectSummaryService,
                private route: ActivatedRoute,
                private router: Router,
                private objectiveAndCostService : DppObjectiveCostService,
                private snackBar: SnackbarHelper,
                private _formBuilder: FormBuilder,
                private utilsService: UtilsService,
                private projectDetailsPartbService: ProjectDetailsPartbService,
                private otherDetailsService: OtherDetailsService,
                private _translateService: TranslateService,
                private snackbarHelper: SnackbarHelper,
                private cdr: ChangeDetectorRef) {
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
        this.getIndicatorList();
        this.getProjectSummary();
    }

    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectSummary = res;
            this.titleEn = res.titleEn;

            this.paripatraVersion = res.paripatraVersion.nameEn;
            this.isEnProject = this._translateService.currentLang === 'en';
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
        });
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
            this.projectTitleEn = res.projectTitleEn;
            this.projectTitleBn = res.projectTitleBn;
            this.buttonEnable();
        })
    }


    getIndicatorList(){
        this.objectiveAndCostService.getIndicatorList().subscribe((response)=>{
            this.indicatorList = response;
        })
    }

    generateReport() {
        let projectName = this.projectTitleEn;
        const isBnLabel = this._translateService.currentLang === 'bn';
        if (isBnLabel) {
            projectName = this.projectTitleBn;
        }
        this.objectiveAndCostService.getIndicatorUrl(this.conceptUuid, this.formGroup.value.indicators, projectName, isBnLabel).subscribe((response)=>{
            this.urlList = response.urlList;
        }, error => {
            this.snackbarHelper.openErrorSnackBarWithMessage(error.error.message, 'OK');
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
            whetherPrivateSector: [''],
            majorConditionalityForeignAid: ['', Validators.required],
            involvementCompensation: ['', Validators.required],
            riskAnalysisMitigation: ['', Validators.required],
            indicators: ['']
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
        this.OtherDetails.isPrivateSector = this.isPrivateSector;
        this.otherDetailsService.saveOtherDetails(this.OtherDetails).subscribe(res => {
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
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
        this.OtherDetails.isPrivateSector = this.isPrivateSector;
        this.otherDetailsService.saveOtherDetails(this.OtherDetails).subscribe(res => {
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
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
            isPrivateSector: res.isPrivateSector
        });
    }

    /* For getting OtherDetails*/
    getOherDetails() {
        this.otherDetailsService.getOtherDetails(this.conceptUuid).subscribe((res) => {
            this.uuid = res.uuid;
            this.isPrivateSector = res.isPrivateSector;
            this.setOtherDetails(res);
            this.cdr.detectChanges();
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
        this.OtherDetails.isPrivateSector = this.isPrivateSector;
        this.otherDetailsService.updateOtherDetails(this.OtherDetails, this.conceptUuid).subscribe((res) => {
            this.spinner = false;
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);

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
        this.OtherDetails.isPrivateSector = this.isPrivateSector;
        this.otherDetailsService.updateOtherDetails(this.OtherDetails, this.conceptUuid).subscribe((res) => {
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);

        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }

    chooseOption(value: boolean) {
        this.isPrivateSector = value;
        this.editor4 = value;
        if(!value){
            this.formGroup.patchValue({
                whetherPrivateSector: ""
            });
        }
    }
}
