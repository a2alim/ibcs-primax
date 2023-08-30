import {Component, OnInit} from '@angular/core';

/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {EffectImpact} from '../../models/effect-impact.model';
import {ProjectDetailsPartbService} from '../../services/project-details-partb.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectDetailsPartB} from '../../models/project-details-partb.model';
import {EffectImpactService} from '../../services/effect-impact.service';
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {environment} from "../../../../../../../../../environments/environment";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import {FileUploadService} from "../../../../../../../core/services/file-upload.service";
import {
    OK,
    SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from "../../../../../../../core/constants/message";
import { UtilsService } from 'app/main/core/services/utils.service';
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";
import {IProjectConcept} from "../../../../../../project-concept-management/models/project-concept";

/*----/Lng Translation----*/

@Component({
    selector: 'app-effect-impact',
    templateUrl: './effect-impact.component.html',
    styleUrls: ['./effect-impact.component.scss']
})
export class EffectImpactComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

    uuid: string;
    conceptUuid = this.route.snapshot.params['id'];
    formGroup: FormGroup;
    attachmentUrl;
    buttonDisable: boolean;
    dppMasterUuid;
    effectImpact: EffectImpact = new EffectImpact();
    projectDetailsPartBRequest: ProjectDetailsPartB = new ProjectDetailsPartB();
    envClearenceAttachment: File;
    content = '';
    isAttachmentEnable: boolean = false;
    effectImpactAttachmentId: any;

    spinner: boolean;
    titleEn: string;
    paripatraVersion: any;
    isParipatra2016: boolean;
    projectSummary: IProjectConcept;

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
    toggleShowType: string;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: ActivatedRoute,
                private router: Router,
                private snackBar: SnackbarHelper,
                private _formBuilder: FormBuilder,
                private _fileUploadService: FileUploadService,
                private objectiveAndCostService : DppObjectiveCostService,
                private projectSummaryService: ProjectSummaryService,
                private utilsService: UtilsService,
                private projectDetailsPartbService: ProjectDetailsPartbService, private _effectImpactService: EffectImpactService) {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla)
    }

    ngOnInit(): void {
        this.loadFormValue();
        this.getDppMasterUuid();
        this.projectDetailsPartbService.getProjectDetailsPartBuuid().subscribe(uuId => {
            this.projectDetailsPartBRequest.uuid = uuId;
        })

        this.getEffectImpact();
        this.getProjectSummary();
    }

    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.projectSummary = res;
            this.titleEn = res.titleEn;

            this.paripatraVersion = res.paripatraVersion.nameEn;
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
            this.buttonEnable();
        })
    }

    toggleShow2(type: string): void {
        this.editor2 = true;

        if (this.toggleShowType != type) {
            this.formGroup.patchValue({
                whetherEnvironmentClearance: '',
            });
        }
        this.toggleShowType =  type;
    }
    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;
    // toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;
    toggleShow3 = () => this.editor3 = this.editor3 = !this.editor3;

    toggleShow4 = () => this.editor4 = this.editor4 = !this.editor4;

    toggleShow5 = () => this.editor5 = this.editor5 = !this.editor5;

    toggleShow6 = () => this.editor6 = this.editor6 = !this.editor6;

    toggleShow7 = () => this.editor7 = this.editor7 = !this.editor7;

    toggleShow8 = () => this.editor8 = this.editor8 = !this.editor8;

    toggleShow9 = () => this.editor9 = this.editor9 = !this.editor9;

    toggleShow10 = () => this.editor10 = this.editor10 = !this.editor10;

    toggleShow11 = () => this.editor11 = this.editor11 = !this.editor11;

    /* For loading FormValue */
    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            uuid: ['', Validators.required],
            otherProjectInstallations: ['', Validators.required],
            envSustainabilityLand: ['', Validators.required],
            futureDisasterManagement: ['', Validators.required],
            genderDisabilityGroups: ['', Validators.required],
            employment: ['', Validators.required],
            provertySituation: ['', Validators.required],
            organizationalArrangement: ['', Validators.required],
            institutionalProductivity: ['', Validators.required],
            regionalDisparity: ['', Validators.required],
            population: ['', Validators.required],
            environmentalProjectCategory: ['', Validators.required],
            whetherEnvironmentClearance: ['', Validators.required],
            envClearenceAttachment: ['']
        })
    }

    /* For setting OtherDetails */
    setEffectImpact(res: any) {
        this.formGroup.patchValue({
            otherProjectInstallations: res.otherProjectInstallations,
            envSustainabilityLand: res.envSustainabilityLand,
            futureDisasterManagement: res.futureDisasterManagement,
            genderDisabilityGroups: res.genderDisabilityGroups,
            employment: res.employment,
            provertySituation: res.provertySituation,
            organizationalArrangement: res.organizationalArrangement,
            institutionalProductivity: res.institutionalProductivity,
            regionalDisparity: res.regionalDisparity,
            population: res.population,
            environmentalProjectCategory: res.environmentalProjectCategory,
            whetherEnvironmentClearance: res.whetherEnvironmentClearance,
            envClearenceAttachment: res.envClearenceAttachment,
        });
    }

    download() {
        this._fileUploadService.downloadAttachmentInDppService(this.attachmentUrl);
    }

    deleteAttachment() {
        this.spinner = true;
        this._fileUploadService.deleteByIdDpp(this.effectImpactAttachmentId).subscribe( res => {
            this.spinner = false;
            this.isAttachmentEnable = false;
            this.envClearenceAttachment = null;
            // this.snackBar.openSuccessSnackBarWithMessage('Succesfully Attachment Delete', OK)
        });
    }

    /* For getting EffectImpact */
    getEffectImpact() {
        this._effectImpactService.getEffectImpact(this.conceptUuid).subscribe((res) => {
            this.setEffectImpact(res);
            this.uuid = res.uuid;

            if (res.envClearenceAttachmentId != null) {
                this.isAttachmentEnable = true;
                this.attachmentUrl = res.envClearenceAttachmentId.urlPath;
                this.effectImpactAttachmentId = res.envClearenceAttachmentId.id;
                this.envClearenceAttachment = res.envClearenceAttachmentId.name;
            }

        })
    }

    selectFile(file: FileList) {
        this.envClearenceAttachment = file.item(0);
        this.onSubmit();
    }

    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.updateEffectImpact();
        }
    }

    onSubmitAndExit() {
        if (this.uuid == null) {
            this.saveAndExit();
        } else {
            this.updateAndExit();
        }
    }

    /* For updating EffectImpact */
    updateEffectImpact() {
        this.spinner = true;
        this.effectImpact.otherProjectInstallations = this.formGroup.value.otherProjectInstallations;
        this.effectImpact.envSustainabilityLand = this.formGroup.value.envSustainabilityLand;
        this.effectImpact.futureDisasterManagement = this.formGroup.value.futureDisasterManagement;
        this.effectImpact.genderDisabilityGroups = this.formGroup.value.genderDisabilityGroups;
        this.effectImpact.employment = this.formGroup.value.employment;
        this.effectImpact.provertySituation = this.formGroup.value.provertySituation;
        this.effectImpact.organizationalArrangement = this.formGroup.value.organizationalArrangement;
        this.effectImpact.institutionalProductivity = this.formGroup.value.institutionalProductivity;
        this.effectImpact.regionalDisparity = this.formGroup.value.regionalDisparity;
        this.effectImpact.population = this.formGroup.value.population;
        // this.effectImpact.projectConceptUuid = this.conceptUuid;
        this.effectImpact.environmentalProjectCategory = this.formGroup.value.environmentalProjectCategory;
        this.effectImpact.whetherEnvironmentClearance = this.formGroup.value.whetherEnvironmentClearance;
        this._effectImpactService.updateEffectImpact(this.conceptUuid, this.effectImpact).subscribe((res) => {
            this.spinner = false;
            this.saveAttachment(res);
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
        })
    }

    /* For updating EffectImpact */
    updateAndExit() {
        this.spinner = true;
        this.effectImpact.otherProjectInstallations = this.formGroup.value.otherProjectInstallations;
        this.effectImpact.envSustainabilityLand = this.formGroup.value.envSustainabilityLand;
        this.effectImpact.futureDisasterManagement = this.formGroup.value.futureDisasterManagement;
        this.effectImpact.genderDisabilityGroups = this.formGroup.value.genderDisabilityGroups;
        this.effectImpact.employment = this.formGroup.value.employment;
        this.effectImpact.provertySituation = this.formGroup.value.provertySituation;
        this.effectImpact.organizationalArrangement = this.formGroup.value.organizationalArrangement;
        this.effectImpact.institutionalProductivity = this.formGroup.value.institutionalProductivity;
        this.effectImpact.regionalDisparity = this.formGroup.value.regionalDisparity;
        this.effectImpact.population = this.formGroup.value.population;
        // this.effectImpact.projectConceptUuid = this.conceptUuid;
        this.effectImpact.environmentalProjectCategory = this.formGroup.value.environmentalProjectCategory;
        this.effectImpact.whetherEnvironmentClearance = this.formGroup.value.whetherEnvironmentClearance;
        this._effectImpactService.updateEffectImpact(this.conceptUuid, this.effectImpact).subscribe((res) => {
            this.spinner = false;
            this.saveAttachment(res);
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);

        })
    }

    /* For saving EffectImpact */
    save() {
        this.spinner = true;
        this.effectImpact.otherProjectInstallations = this.formGroup.value.otherProjectInstallations;
        this.effectImpact.envSustainabilityLand = this.formGroup.value.envSustainabilityLand;
        this.effectImpact.futureDisasterManagement = this.formGroup.value.futureDisasterManagement;
        this.effectImpact.genderDisabilityGroups = this.formGroup.value.genderDisabilityGroups;
        this.effectImpact.employment = this.formGroup.value.employment;
        this.effectImpact.provertySituation = this.formGroup.value.provertySituation;
        this.effectImpact.organizationalArrangement = this.formGroup.value.organizationalArrangement;
        this.effectImpact.institutionalProductivity = this.formGroup.value.institutionalProductivity;
        this.effectImpact.regionalDisparity = this.formGroup.value.regionalDisparity;
        this.effectImpact.population = this.formGroup.value.population;
        this.effectImpact.projectConceptUuid = this.conceptUuid;
        this.effectImpact.environmentalProjectCategory = this.formGroup.value.environmentalProjectCategory;
        this.effectImpact.whetherEnvironmentClearance = this.formGroup.value.whetherEnvironmentClearance;
        // this.effectImpact.envClearenceAttachment = this.formGroup.value.envClearenceAttachment;
        // this.effectImpact.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this._effectImpactService.saveEffectImpact(this.effectImpact).subscribe(res => {
            this.spinner = false;
            this.saveAttachment(res);
        });
        this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
        this.spinner = false;
    }

    /* For saving EffectImpact */
    saveAndExit() {
        this.spinner = true;
        this.effectImpact.otherProjectInstallations = this.formGroup.value.otherProjectInstallations;
        this.effectImpact.envSustainabilityLand = this.formGroup.value.envSustainabilityLand;
        this.effectImpact.futureDisasterManagement = this.formGroup.value.futureDisasterManagement;
        this.effectImpact.genderDisabilityGroups = this.formGroup.value.genderDisabilityGroups;
        this.effectImpact.employment = this.formGroup.value.employment;
        this.effectImpact.provertySituation = this.formGroup.value.provertySituation;
        this.effectImpact.organizationalArrangement = this.formGroup.value.organizationalArrangement;
        this.effectImpact.institutionalProductivity = this.formGroup.value.institutionalProductivity;
        this.effectImpact.regionalDisparity = this.formGroup.value.regionalDisparity;
        this.effectImpact.population = this.formGroup.value.population;
        this.effectImpact.projectConceptUuid = this.conceptUuid;
        this.effectImpact.environmentalProjectCategory = this.formGroup.value.environmentalProjectCategory;
        this.effectImpact.whetherEnvironmentClearance = this.formGroup.value.whetherEnvironmentClearance;
        // this.effectImpact.envClearenceAttachment = this.formGroup.value.envClearenceAttachment;
        // this.effectImpact.projectDetailsPartBRequest = this.projectDetailsPartBRequest;
        this._effectImpactService.saveEffectImpact(this.effectImpact).subscribe(res => {
            this.spinner = false;
            this.saveAttachment(res);
        });
        this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        this.snackBar.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
        this.spinner = false;
    }

    saveAttachment(effectImpact) {
        this._effectImpactService.saveEffectImpactAttachment(effectImpact.id, this.envClearenceAttachment).subscribe(res => {
            this.getEffectImpact();
        });
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }

    navigateToPILS(){
        this._effectImpactService.sendProjectDataToPlis(this.conceptUuid).subscribe((res) => {
            if (res.project_id != null) {
                window.open("http://118.179.197.118:80/dppdetails?id=" + res.project_id, '_blank');
            }
        });
    }
}
