/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../core/services/translation-loader.service';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { TappProjectDetailsService } from 'app/main/modules/dpp-tapp-management/services/tapp-project-details.service';
import { GlobalValidationService } from 'app/global/validation/global-validation.service';
import { ActivatedRoute } from '@angular/router';
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
/*----/Lng Translation----*/

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    tappObjectiveCostUuid = '';
    pcUuid = this.route.snapshot.params['id'];
    editor1 = false;
    editor2 = false;
    editor3 = false;
    editor4 = false;
    editor5 = false;
    editor6 = false;
    editor7 = false;
    editor8 = false;
    editor9 = false;
    editor10 = false;
    editor11 = false;
    editor12 = false;
    editor13 = false;
    editor14 = false;
    editor15 = false;
    pcMasterId: number;
    pdUuid: string;
    title: string;

    tappMasterUuid;
    frmGroup: FormGroup;

    spinner: boolean;
    paripatraVersion: string;
    isParipatra2016: boolean;
    isForeignAid: boolean;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private matSnackBar: SnackbarHelper,
        private  tappObjectiveCostService: TappObjectiveCostService,
        private tappProjectDetailsService: TappProjectDetailsService,
        private globalVal: GlobalValidationService,
        private pcService: ProjectSummaryService,
        private utilsService: UtilsService,
        private route: ActivatedRoute
    ) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.frmGroup = this.formBuilder.group({
            id:[''],
            uuid:[''],
            situationAnalysis: ['',
                [this.globalVal.trimValidator('Field')],
            ],

            tappObjectiveCostUuid: [this.route.snapshot.params['id'], [this.globalVal.trimValidator('Field')]],

            objectives: ['', [this.globalVal.trimValidator('Field')]],
            specificDetails: ['', [this.globalVal.trimValidator('Field')]],
            visionMission: ['', [this.globalVal.trimValidator('Field')]],
            projectContribute: ['', [this.globalVal.trimValidator('Field')]],
            implementationArrangements: ['', [this.globalVal.trimValidator('Field')]],
            expectedOutputOutcome: ['', [this.globalVal.trimValidator('Field')]],
            monitoringEvaluationReporting: ['', [this.globalVal.trimValidator('Field')]],
            visionMissionOfAgency: ['', [this.globalVal.trimValidator('Field')]],
            implementationFramework: ['', [this.globalVal.trimValidator('Field')]],
            expectedOutputOutcomeDescription: ['', [this.globalVal.trimValidator('Field')]],
            interimMidtermAssessment: ['', [this.globalVal.trimValidator('Field')]],
            legalContext: ['', [this.globalVal.trimValidator('Field')]],
      });
    }

    ngOnInit(): void {
        this.getPcMasterId();
        // this.editor1 = false;
        // this.editor2 = false;
        // this.editor3 = false;
        // this.editor4 = false;
        // this.editor5 = false;
        // this.editor6 = false;
        // this.editor7 = false;
        // this.editor8 = false;
        // this.editor9 = false;
        // this.setFormFieldValue();
    }

    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;
    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;
    toggleShow3 = () => this.editor3 = this.editor3 = !this.editor3;
    toggleShow4 = () => this.editor4 = this.editor4 = !this.editor4;
    toggleShow5 = () => this.editor5 = this.editor5 = !this.editor5;
    toggleShow6 = () => this.editor6 = this.editor6 = !this.editor6;
    toggleShow7 = () => this.editor7 = this.editor7 = !this.editor7;
    toggleShow8 = () => this.editor8 = this.editor8 = !this.editor8;
    toggleShow9 = () => this.editor9 = this.editor9 = !this.editor9;
    toggleShow10 = () => this.editor10 = this.editor10 = !this.editor10;
    toggleShow11 = () => this.editor11 = this.editor11 = !this.editor11;
    toggleShow12 = () => this.editor12 = this.editor12 = !this.editor12;
    toggleShow13 = () => this.editor13 = this.editor13 = !this.editor13;
    toggleShow14 = () => this.editor14 = this.editor14 = !this.editor14;
    toggleShow15 = () => this.editor15 = this.editor15 = !this.editor15;

    onSubmit() {
        if (this.pdUuid == null) {
            this.saveData();
        } else {
            this.updateData();
        }
    }

    private getTappMasterData(){
        this.tappObjectiveCostService.getProjectConceptByUuid(this.pcUuid).subscribe((response) =>{
            let res = response.res;
            this.tappMasterUuid = res.uuid;
            this.pcMasterId = res.id;
            this.title = this.isForeignAid ? res.projectTitleEn : res.projectTitleBn;
        })
    }

    getPcMasterId(){
        this.pcService.getByUuid(this.pcUuid).subscribe((res)=>{
            this.paripatraVersion = res.paripatraVersion.nameEn;
            if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
                this.isParipatra2016 = true;
            } else {
                this.isParipatra2016 = false;
            }
            this.pcMasterId = res.id;
            this.isForeignAid = res.isForeignAid;
            this.loadFormValue();
            this.getProjectDetails();
            this.getTappMasterData();
        })
    }

    loadFormValue(){
        this.frmGroup = this.formBuilder.group({
            id:[''],
            uuid:[''],
            pcMasterId: [this.pcMasterId],
            pcUuid: [this.pcUuid],
            situationAnalysis: ['',
                [this.globalVal.trimValidator('Field')],
            ],
            objectives: ['', [this.globalVal.trimValidator('Field')]],
            specificDetails: ['', [this.globalVal.trimValidator('Field')]],
            visionMission: ['', [this.globalVal.trimValidator('Field')]],
            projectContribute: ['', [this.globalVal.trimValidator('Field')]],
            implementationArrangements: ['', [this.globalVal.trimValidator('Field')]],
            expectedOutputOutcome: ['', [this.globalVal.trimValidator('Field')]],
            monitoringEvaluationReporting: ['', [this.globalVal.trimValidator('Field')]],
            visionMissionOfAgency: ['', [this.globalVal.trimValidator('Field')]],
            implementationFramework: ['', [this.globalVal.trimValidator('Field')]],
            expectedOutputOutcomeDescription: ['', [this.globalVal.trimValidator('Field')]],
            interimMidtermAssessment: ['', [this.globalVal.trimValidator('Field')]],
            legalContext: ['', [this.globalVal.trimValidator('Field')]],
        });
    }

    saveData() {
        if(this.tappMasterUuid != null){
            this.spinner = true;
            this.tappProjectDetailsService.saveData(this.frmGroup.value).subscribe((res) => {
                this.matSnackBar.openSuccessSnackBar();
                this.spinner = false;
                this.getProjectDetails();
            });
        }else{
            this.matSnackBar.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }
    }

    updateData(){
        this.spinner = true;
        this.tappProjectDetailsService.updateData(this.frmGroup.value, this.pcUuid).subscribe((res)=>{
                this.matSnackBar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");
                this.spinner = false;
                this.getProjectDetails();
        })
    }

    getProjectDetails(){
        this.tappProjectDetailsService.getProjectDetails(this.pcUuid).subscribe((response) =>{
            let res = response.res;
            this.pdUuid = res.uuid;
            this.frmGroup = this.formBuilder.group({
                id:[res.id],
                uuid:[res.uuid],
                pcMasterId: [this.pcMasterId],
                pcUuid: [this.pcUuid],
                situationAnalysis: [res.situationAnalysis ,[this.globalVal.trimValidator('Field')]],
                objectives: [res.objectives ,[this.globalVal.trimValidator('Field')]],
                specificDetails: [res.specificDetails ,[this.globalVal.trimValidator('Field')]],
                visionMission: [res.visionMission ,[this.globalVal.trimValidator('Field')]],
                projectContribute: [res.projectContribute ,[this.globalVal.trimValidator('Field')]],
                implementationArrangements: [res.implementationArrangements ,[this.globalVal.trimValidator('Field')]],
                expectedOutputOutcome: [res.expectedOutputOutcome ,[this.globalVal.trimValidator('Field')]],
                monitoringEvaluationReporting: [res.monitoringEvaluationReporting ,[this.globalVal.trimValidator('Field')]],
                visionMissionOfAgency: [res.visionMissionOfAgency ,[this.globalVal.trimValidator('Field')]],
                implementationFramework: [res.implementationFramework ,[this.globalVal.trimValidator('Field')]],
                expectedOutputOutcomeDescription: [res.expectedOutputOutcomeDescription ,[this.globalVal.trimValidator('Field')]],
                interimMidtermAssessment: [res.interimMidtermAssessment ,[this.globalVal.trimValidator('Field')]],
                legalContext: [res.legalContext ,[this.globalVal.trimValidator('Field')]]
            });
        })
    }

    goBackToHome()
    {
       window.history.back();
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
    }

}
