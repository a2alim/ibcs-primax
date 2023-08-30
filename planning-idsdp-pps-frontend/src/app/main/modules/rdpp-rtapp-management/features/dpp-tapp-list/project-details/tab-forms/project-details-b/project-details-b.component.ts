import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {ProjectDetailsPartB} from '../../models/project-details-partb.model';
import {ProjectDetailsPartbService} from '../../services/project-details-partb.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProjectSummaryService} from "../../../../../../project-concept-management/services/project-summary.service";
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {DppObjectiveCostService} from "../../../../../services/dpp-objective-cost.service";
import { UtilsService } from 'app/main/core/services/utils.service';

/*----/Lng Translation----*/

@Component({
    selector: 'app-project-details-b',
    templateUrl: './project-details-b.component.html',
    styleUrls: ['./project-details-b.component.scss']
})
export class ProjectDetailsBComponent implements OnInit {

    @Output() backPreviousPage = new EventEmitter<boolean>();
    conceptUuid = this.route.snapshot.params['id'];
    uuid: string;
    projectConceptMasterId: number;
    formGroup: FormGroup;
    spinner: boolean;

    constructor(
        private projectSummaryService: ProjectSummaryService,
        private route: ActivatedRoute,
        private router: Router,
        private objectiveAndCostService : DppObjectiveCostService,
        private snackbarHelper: SnackbarHelper,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private projectDetailsPartbService: ProjectDetailsPartbService,
        private utilsService: UtilsService,
        private _snackBar: MatSnackBar) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    @Output() nextStep = new EventEmitter<boolean>();
    projectDetailsPartB: ProjectDetailsPartB = new ProjectDetailsPartB();

    editor1 = false;
    editor2 = false;
    editor3 = false;
    editor4 = false;
    editor5 = false;
    editor6 = false;
    editor7 = false;
    editor8 = false;
    editor9 = false;

    linkages;
    povertySituation;
    objective;
    outcomes;
    output;
    activities;
    sexDisaggregated;
    population;
    buttonDisable: boolean;
    dppMasterUuid;


    ngOnInit(): void {
        this.loadFormValue();
        this.getDppMasterUuid();
        // this.getProjectSummaryPartB();

        this.getProjectConceptById();
        this.getProjectDetailsByProjectId();


    }

    /* For getting ProjectConceptById */
    private getProjectConceptById() {

        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
            this.conceptUuid = res.uuid;
            this.projectConceptMasterId = res.id;
        });

    }

    /* For getting Master table data */
    getDppMasterUuid(){
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response)=>{
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    /* For setting project details */
    setProjectDetails(res: any) {
        this.formGroup.patchValue({
            uuid: res.uuid,
            backgroundStatement: res.backgroundStatement,
            linkages: res.linkages,
            povertySituation: res.povertySituation,
            objective: res.objective,
            outcomes: res.outcomes,
            output: res.output,
            activities: res.activities,
            sexDisaggregated: res.sexDisaggregated,
            populationCoverage: res.populationCoverage,
            projectId: res.projectId,
        });
    }

    buttonEnable(){
        if(this.dppMasterUuid == null){
            this.buttonDisable = true;
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & cost data is not provided yet!", "")
        }else{
            this.buttonDisable= false;
        }
    }

    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            backgroundStatement: ['', Validators.required],
            linkages: ['', [Validators.required, Validators.email]],
            povertySituation: ['', Validators.required],
            objective: ['', Validators.required],
            outcomes: ['', Validators.required],
            output: ['', Validators.required],
            activities: ['', Validators.required],
            sexDisaggregated: ['', Validators.required],
            populationCoverage: ['', Validators.required]

        });
    }

    /* For ck editor collapsing */
    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;

    toggleShow3 = () => this.editor3 = this.editor3 = !this.editor3;

    toggleShow4 = () => this.editor4 = this.editor4 = !this.editor4;

    toggleShow5 = () => this.editor5 = this.editor5 = !this.editor5;

    toggleShow6 = () => this.editor6 = this.editor6 = !this.editor6;

    toggleShow7 = () => this.editor7 = this.editor7 = !this.editor7;

    toggleShow8 = () => this.editor8 = this.editor8 = !this.editor8;

    toggleShow9 = () => this.editor9 = this.editor9 = !this.editor9;

    /* For saving projectDetailsPartB */
    save() {
        this.projectDetailsPartB.backgroundStatement = this.formGroup.value.backgroundStatement;
        this.projectDetailsPartB.linkages = this.formGroup.value.linkages;
        this.projectDetailsPartB.povertySituation = this.formGroup.value.povertySituation;
        this.projectDetailsPartB.objective = this.formGroup.value.objective;
        this.projectDetailsPartB.outcomes = this.formGroup.value.outcomes;
        this.projectDetailsPartB.output = this.formGroup.value.output;
        this.projectDetailsPartB.activities = this.formGroup.value.activities;
        this.projectDetailsPartB.sexDisaggregated = this.formGroup.value.sexDisaggregated;
        this.projectDetailsPartB.populationCoverage = this.formGroup.value.populationCoverage;
        this.projectDetailsPartB.projectConceptUuid = this.conceptUuid;
        this.projectDetailsPartB.projectConceptMasterId = this.projectConceptMasterId;

        // if(this.formGroup.value.backgroundStatement!=null && this.formGroup.value.linkages!=null
        //     && this.formGroup.value.povertySituation!=null && this.formGroup.value.objective!=null
        //     && this.formGroup.value.outcomes!=null && this.formGroup.value.output!=null
        //     && this.formGroup.value.activities!=null && this.formGroup.value.sexDisaggregated!=null
        //     && this.formGroup.value.populationCoverage!=null){
        this.spinner = true;
        if(this.dppMasterUuid != null){
            this.projectDetailsPartbService.saveProjectDetailsPartB(this.projectDetailsPartB).subscribe(res => {

                if (res.uuid) {
                    this.projectDetailsPartbService.projectDetailsPartBSubject.next(res.uuid);

                    this.getProjectDetailsByProjectId();
                    this.snackbarHelper.openSuccessSnackBar();
                    this.nextStep.next(true);
                } else {
                    this.snackbarHelper.openErrorSnackBar();

                }
                this.spinner = false;
            })
        }else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & Cost Data Not Found", "Error");
            this.spinner = false;
        }


    }

    /* For saving projectDetailsPartB */
    saveAndExit() {
        this.projectDetailsPartB.backgroundStatement = this.formGroup.value.backgroundStatement;
        this.projectDetailsPartB.linkages = this.formGroup.value.linkages;
        this.projectDetailsPartB.povertySituation = this.formGroup.value.povertySituation;
        this.projectDetailsPartB.objective = this.formGroup.value.objective;
        this.projectDetailsPartB.outcomes = this.formGroup.value.outcomes;
        this.projectDetailsPartB.output = this.formGroup.value.output;
        this.projectDetailsPartB.activities = this.formGroup.value.activities;
        this.projectDetailsPartB.sexDisaggregated = this.formGroup.value.sexDisaggregated;
        this.projectDetailsPartB.populationCoverage = this.formGroup.value.populationCoverage;
        this.projectDetailsPartB.projectConceptUuid = this.conceptUuid;
        this.projectDetailsPartB.projectConceptMasterId = this.projectConceptMasterId;
        this.spinner = true;
        if(this.dppMasterUuid != null){
            this.projectDetailsPartbService.saveProjectDetailsPartB(this.projectDetailsPartB).subscribe(res => {
                if (res.uuid) {
                    this.projectDetailsPartbService.projectDetailsPartBSubject.next(res.uuid);
                    this.snackbarHelper.openSuccessSnackBar();
                    this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            })
        }else {
            this.snackbarHelper.openErrorSnackBarWithMessage("Objectives & Cost Data Not Found", "Error")
            this.spinner = false;
        }

    }

    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.upadteProjectdetails();
        }
    }

    onSubmitAndExit() {
        if (this.uuid == null) {
            this.saveAndExit();
        } else {
            this.upadteAndExit();
        }
    }

    /* For updating Projectdetails */
    upadteProjectdetails() {
        this.projectDetailsPartB.backgroundStatement = this.formGroup.value.backgroundStatement;
        this.projectDetailsPartB.linkages = this.formGroup.value.linkages;
        this.projectDetailsPartB.povertySituation = this.formGroup.value.povertySituation;
        this.projectDetailsPartB.objective = this.formGroup.value.objective;
        this.projectDetailsPartB.outcomes = this.formGroup.value.outcomes;
        this.projectDetailsPartB.output = this.formGroup.value.output;
        this.projectDetailsPartB.activities = this.formGroup.value.activities;
        this.projectDetailsPartB.sexDisaggregated = this.formGroup.value.sexDisaggregated;
        this.projectDetailsPartB.populationCoverage = this.formGroup.value.populationCoverage;
        this.projectDetailsPartB.projectConceptUuid = this.conceptUuid;
        this.projectDetailsPartB.uuid = this.uuid;
        this.projectDetailsPartB.projectConceptMasterId = this.projectConceptMasterId;
        this.spinner = true;
        this.projectDetailsPartbService.updateProjectDetails(this.projectDetailsPartB, this.conceptUuid).subscribe(res => {
            if (this.uuid != null) {
                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");

                this.nextStep.next(true);
            } else {
                this.nextStep.next(false);
                this.snackbarHelper.openErrorSnackBarWithMessage("Failed to updated data", "Error");
            }
            this.spinner = false;
        })
    }

    /* For updating Projectdetails */
    upadteAndExit() {
        this.projectDetailsPartB.backgroundStatement = this.formGroup.value.backgroundStatement;
        this.projectDetailsPartB.linkages = this.formGroup.value.linkages;
        this.projectDetailsPartB.povertySituation = this.formGroup.value.povertySituation;
        this.projectDetailsPartB.objective = this.formGroup.value.objective;
        this.projectDetailsPartB.outcomes = this.formGroup.value.outcomes;
        this.projectDetailsPartB.output = this.formGroup.value.output;
        this.projectDetailsPartB.activities = this.formGroup.value.activities;
        this.projectDetailsPartB.sexDisaggregated = this.formGroup.value.sexDisaggregated;
        this.projectDetailsPartB.populationCoverage = this.formGroup.value.populationCoverage;
        this.projectDetailsPartB.projectConceptUuid = this.conceptUuid;
        this.projectDetailsPartB.uuid = this.uuid;
        this.projectDetailsPartB.projectConceptMasterId = this.projectConceptMasterId;
        this.spinner = true;
        this.projectDetailsPartbService.updateProjectDetails(this.projectDetailsPartB, this.conceptUuid).subscribe(res => {
            if (this.uuid != null) {
                this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");

            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage("Failed to updated data", "Error");
            }
            this.spinner = false;
        })
    }

//  Get project details part-b by pcUuid
    getProjectDetailsByProjectId() {
        this.projectDetailsPartbService.getProjectDetailsByProjectId(this.conceptUuid).subscribe((res) => {
            this.setProjectDetails(res);
            this.uuid = res.uuid;

        })
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }
}
