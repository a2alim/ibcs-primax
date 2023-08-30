import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
/*----Lng Translation----*/
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { SimilarProjectStudy } from '../../models/similar-project-study.model';
import { SimilarProjectStudyService } from '../../services/similar-project-study.service';
import { ProjectDetailsPartbService } from '../../services/project-details-partb.service';
import { ProjectDetailsPartB } from '../../models/project-details-partb.model';
import { ActivatedRoute, Router } from "@angular/router";
import { SnackbarHelper } from "../../../../../../../core/helper/snackbar.helper";
import { ProjectSummaryService } from "../../../../../../project-concept-management/services/project-summary.service";
import { DppObjectiveCostService } from "../../../../../services/dpp-objective-cost.service";
import { DppAnnualPhasingCostTabDetailsService } from '../../../../../services/dpp-annual-phasing-cost-tab-details.service';
import { UtilsService } from 'app/main/core/services/utils.service';


/*----/Lng Translation----*/
@Component({
    selector: 'app-similar-project-study',
    templateUrl: './similar-project-study.component.html',
    styleUrls: ['./similar-project-study.component.scss']
})
export class SimilarProjectStudyComponent implements OnInit {
    formGroup: FormGroup;
    conceptUuid = this.route.snapshot.params['id'];
    uuid: any;
    indicateIssuesMakeProject;
    masterId: number;
    major: boolean;
    indicateIssuesNotWork;
    projectConceptMasterId;
    similarProjectStudy: SimilarProjectStudy = new SimilarProjectStudy();
    projectDetails: ProjectDetailsPartB = new ProjectDetailsPartB();
    majorItemUuid: string;
    editor1 = false;
    editor2 = false;
    buttonDisable: boolean;
    dppMasterUuid;
    annexVBMajorItem: any;
    incicateBasisItem: boolean;
    giveComparativeCost: boolean;
    majorItem: boolean = true;
    componentName: any;

    spinner: boolean;

    rows1: FormArray = this._formBuilder.array([]);
    rows2: FormArray = this._formBuilder.array([]);

    form = this._formBuilder.group({
        itemWiseCostEstimatedList: this.rows1,
        costOfMajorItemList: this.rows2,
    });


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private snackBar: SnackbarHelper,
        private router: Router,
        private objectiveAndCostService: DppObjectiveCostService,
        private projectSummaryService: ProjectSummaryService,
        private similarProjectStudyService: SimilarProjectStudyService,
        private dppAnnualPhasingCostTabDetailsService: DppAnnualPhasingCostTabDetailsService,
        private utilsService: UtilsService,

        private _projectDetailsPartBService: ProjectDetailsPartbService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getDppMasterUuid();
        this.loadFormValue();
        this._projectDetailsPartBService.getProjectDetailsPartBuuid().subscribe(uuId => {
            this.projectDetails.uuid = uuId;
        })
        this.getProjectConceptByUuid();

    }

    getProjectConceptByUuid() {
        this.projectSummaryService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.projectConceptMasterId = res.id;
            this.getSimilarProject();
        })
    }

    buttonEnable() {
        if (this.dppMasterUuid == null) {
            this.buttonDisable = true;
        } else {
            this.buttonDisable = false;
        }
    }

    /* For getting Master table data */
    getDppMasterUuid() {
        this.objectiveAndCostService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            this.dppMasterUuid = res.uuid;
            this.buttonEnable();
        })
    }

    /*
     ********* Add new row for execution table
     */
    addRow1() {
        const row = this._formBuilder.group({
            majorItem: [''],
            unit: [''],
            unitCost: [''],
            basis: [''],
            source: [''],
            itemWiseCostDate: [''],
        });
        this.rows1.push(row);
    }

    addRow2() {
        const row = this._formBuilder.group({
            majorItem: [''],
            unit: [''],
            proposalProject: [''],
            similarGoingProject: [''],
            similarCompleteProject: [''],
            remarks: [''],
        });
        this.rows2.push(row);
    }

    toggleShow1 = () => this.editor1 = this.editor1 = !this.editor1;

    toggleShow2 = () => this.editor2 = this.editor2 = !this.editor2;

    /* For loading FormValue */
    loadFormValue() {
        this.formGroup = this._formBuilder.group({
            indicateIssuesMakeProject: ['', Validators.required],
            indicateIssuesNotWork: ['', Validators.required],

        })
    }

    // Load annexure 5b major item value
    loadGetMajorItem() {
        if (this.uuid == null) {
            this.getMajorItem();
        } else {
            return false;
        }
    }

    // conditional save of update
    onSubmit() {
        if (this.uuid == null) {
            this.save();
        } else {
            this.updateSimilarProjectStudy();
        }
    }

    onSubmitAndExit() {
        if (this.uuid == null) {
            this.saveAndExit();
        } else {
            this.updateAndExit();
        }
    }

    /* For saving Similar Project Study */
    save() {
        this.spinner = true;
        this.similarProjectStudy.indicateIssuesMakeProject = this.formGroup.value.indicateIssuesMakeProject;
        this.similarProjectStudy.indicateIssuesNotWork = this.formGroup.value.indicateIssuesNotWork;
        // this.similarProjectStudy.projectDetailsPartBRequest = this.projectDetails;
        this.similarProjectStudy.projectConceptUuid = this.conceptUuid;
        this.similarProjectStudy.costOfMajorItemList = this.form.value.costOfMajorItemList;
        this.similarProjectStudy.itemWiseCostEstimatedList = this.form.value.itemWiseCostEstimatedList;
        this.similarProjectStudy.projectConceptMasterId = this.projectConceptMasterId;

        this.similarProjectStudyService.saveSimilarProjectStudy(this.similarProjectStudy).subscribe(res => {

            this.snackBar.openSuccessSnackBar();
            this.spinner = false;
        });
    }


    // for save and exit button
    saveAndExit() {
        this.spinner = true;
        this.similarProjectStudy.indicateIssuesMakeProject = this.formGroup.value.indicateIssuesMakeProject;
        this.similarProjectStudy.indicateIssuesNotWork = this.formGroup.value.indicateIssuesNotWork;
        // this.similarProjectStudy.projectDetailsPartBRequest = this.projectDetails;
        this.similarProjectStudy.projectConceptUuid = this.conceptUuid;
        this.similarProjectStudy.costOfMajorItemList = this.form.value.costOfMajorItemList;
        this.similarProjectStudy.itemWiseCostEstimatedList = this.form.value.itemWiseCostEstimatedList;
        this.similarProjectStudy.projectConceptMasterId = this.projectConceptMasterId;
        this.similarProjectStudyService.saveSimilarProjectStudy(this.similarProjectStudy).subscribe(res => {

            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
            this.spinner = false;
            this.snackBar.openSuccessSnackBar();
        });
    }


    // For Update Similar Project Study
    updateSimilarProjectStudy() {
        this.spinner = true;
        this.similarProjectStudy.indicateIssuesMakeProject = this.formGroup.value.indicateIssuesMakeProject;
        this.similarProjectStudy.indicateIssuesNotWork = this.formGroup.value.indicateIssuesNotWork;
        this.similarProjectStudy.costOfMajorItemList = this.form.value.costOfMajorItemList;
        this.similarProjectStudy.itemWiseCostEstimatedList = this.form.value.itemWiseCostEstimatedList;
        this.similarProjectStudyService.udpateSimilarProjectStudy(this.similarProjectStudy, this.conceptUuid).subscribe((res) => {

            this.snackBar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");
            this.spinner = false;
        });
    }

    updateAndExit() {
        this.spinner = true;
        this.similarProjectStudy.indicateIssuesMakeProject = this.formGroup.value.indicateIssuesMakeProject;
        this.similarProjectStudy.indicateIssuesNotWork = this.formGroup.value.indicateIssuesNotWork;
        this.similarProjectStudy.costOfMajorItemList = this.form.value.costOfMajorItemList;
        this.similarProjectStudy.itemWiseCostEstimatedList = this.form.value.itemWiseCostEstimatedList;
        this.similarProjectStudyService.udpateSimilarProjectStudy(this.similarProjectStudy, this.conceptUuid).subscribe((res) => {

            this.snackBar.openSuccessSnackBarWithMessage("Successfully Updated Data", "Ok");
            this.spinner = false;
            this.router.navigate(['dpp-tapp/dashboard/' + this.conceptUuid]);
        });
    }

    // get major item form annexure 5b
    getMajorItem() {
        // this.similarProjectStudyService.getMajorItem(this.majorItem).subscribe((response) => {
        this.dppAnnualPhasingCostTabDetailsService.getByProjectConceptIdAndIsBasisOrIsMajor(this.projectConceptMasterId, true,true).subscribe((response) => {
            let res = response;
            this.annexVBMajorItem = response;
            for (let i = 0; i < res.length; i++) {
                // this.majorItemUuid = res[i].dppAnnualPhasingCost.projectConceptUuid;
                // alert("hello"+ res[i].dppAnnualPhasingCost.projectConceptUuid)
                // if(this.majorItemUuid == this.conceptUuid){
                // if (this.majorItemUuid == this.conceptUuid) {
                this.incicateBasisItem = true;
                this.giveComparativeCost = true;
                if(res[i].isBasis == true){
                    const row = this._formBuilder.group({
                        majorItem: res[i].subEconomicCodeId + ': ' + res[i].description,
                        unit: res[i].unitId,
                        unitTypeName: res[i].unitTypeDTO.unitTypeNameEng,
                        unitCost: res[i].unitCost.toFixed(2),
                        basis: '',
                        source: '',
                        itemWiseCostDate: '',

                    });
                    this.rows1.push(row);
                }
                if(res[i].isMajor == true){
                    const row2 = this._formBuilder.group({
                        majorItem: res[i].subEconomicCodeId + ': ' + res[i].description,
                        unit: res[i].unitId,
                        unitTypeName: res[i].unitTypeDTO.unitTypeNameEng,
                        proposalProject: res[i].unitCost.toFixed(2),
                        similarGoingProject: '',
                        similarCompleteProject: '',
                        remarks: '',

                    });
                    this.rows2.push(row2);
                }
                // }
            }
        })
    }


    // get similar project study data
    getSimilarProject() {
        this.similarProjectStudyService.getSimilarProjectStudy(this.conceptUuid).subscribe((response) => {
            let res = response.res;
            if (response.status == 0) {
                this.getMajorItem()
            } else {
                this.uuid = res.uuid;
                this.incicateBasisItem = true
                this.giveComparativeCost = true;
                this.setSimilarProject(res);
                if (res.itemWiseCostEstimatedList != null) {
                    if (res.itemWiseCostEstimatedList.length > 0) {
                        res.itemWiseCostEstimatedList.forEach(re => {

                            const row = this._formBuilder.group({
                                majorItem: re.majorItem,
                                unit: re.unit,
                                unitTypeName: re.unitType.unitTypeNameEng,
                                unitCost: re.unitCost,
                                basis: re.basis,
                                source: re.source,
                                itemWiseCostDate: re.itemWiseCostDate,

                            });
                            this.rows1.push(row);
                        })
                    } else {
                        this.incicateBasisItem = false
                        this.giveComparativeCost = false;
                    }
                }

                if (res.costOfMajorItemList != null) {
                    if (res.costOfMajorItemList.length > 0) {
                        res.costOfMajorItemList.forEach(re => {
                            const row = this._formBuilder.group({
                                majorItem: re.majorItem,
                                unit: re.unit,
                                unitTypeName: re.unitType.unitTypeNameEng,
                                proposalProject: re.proposalProject,
                                similarGoingProject: re.similarGoingProject,
                                similarCompleteProject: re.similarCompleteProject,
                                remarks: re.remarks,

                            });
                            this.rows2.push(row);
                        })
                    } else {
                        this.incicateBasisItem = false
                        this.giveComparativeCost = false;
                    }
                }
            }

        })
    }

    setSimilarProject(res: any) {
        this.formGroup.patchValue({
            indicateIssuesMakeProject: res.indicateIssuesMakeProject,
            indicateIssuesNotWork: res.indicateIssuesNotWork,
        });
    }

    /* For getting Similar Project Study */
    getProjectStudy() {
        this.similarProjectStudyService.getSimilarProjectStudy(this.conceptUuid).subscribe((res) => {
            this.indicateIssuesNotWork = res.indicateIssuesNotWork;
            this.uuid = res.uuid;
            this.indicateIssuesMakeProject = res.indicateIssuesMakeProject;
            if (res.itemWiseCostEstimatedList != null) {
                if (res.itemWiseCostEstimatedList.length > 0) {
                    res.itemWiseCostEstimatedList.forEach(re => {

                        const row = this._formBuilder.group({
                            majorItem: re.majorItem,
                            unit: re.unit,
                            unitCost: re.unitCost,
                            basis: re.basis,
                            source: re.source,
                            itemWiseCostDate: re.itemWiseCostDate,

                        });
                        this.rows1.push(row);
                    })
                }
            }

            if (res.costOfMajorItemList != null) {
                if (res.costOfMajorItemList.length > 0) {
                    res.costOfMajorItemList.forEach(re => {

                        const row = this._formBuilder.group({
                            majorItem: re.majorItem,
                            unit: re.unit,
                            proposalProject: re.proposalProject,
                            similarGoingProject: re.similarGoingProject,
                            similarCompleteProject: re.similarCompleteProject,
                            remarks: re.remarks,

                        });
                        this.rows2.push(row);
                    })
                }
            }

        })
    }

    get costOfMajorItemList() {
        return this.form.controls['costOfMajorItemList'] as FormArray;
    }

    get itemWiseCostEstimatedList() {
        return this.form.controls['itemWiseCostEstimatedList'] as FormArray;
    }


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }


}
