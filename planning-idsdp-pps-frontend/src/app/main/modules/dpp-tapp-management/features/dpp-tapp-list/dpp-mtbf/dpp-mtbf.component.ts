import { Component, OnInit } from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectSummaryService} from "../../../../project-concept-management/services/project-summary.service";
import {TranslateService} from "@ngx-translate/core";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import { DppAnnualPhasingCostService } from '../../../services/dpp-annual-phasing-cost.service';
import { MtbfService } from '../../../services/mtbf.service';
import { MtbfModel } from '../../../models/mtbf-model.model';
import {
    FAILED_SAVE, FAILED_UPDATE,
    SUCCESSFULLY_SAVE,
    SUCCESSFULLY_SAVE_BN,
    SUCCESSFULLY_UPDATED,
    SUCCESSFULLY_UPDATED_BN
} from 'app/main/core/constants/message';
import { MtbfFiscalYearDetailsListModel } from '../../../models/mtbf-fiscal-year-details-list-model.model';
import {MEDIUM_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {messages} from "../../../../../../mock-api/common/messages/data";

@Component({
  selector: 'app-dpp-mtbf',
  templateUrl: './dpp-mtbf.component.html',
  styleUrls: ['./dpp-mtbf.component.scss']
})
export class DppMtbfComponent extends UnsubscribeAdapterComponent implements OnInit {
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    spinner: boolean;
    projectConceptUuid: any;
    projectConceptId: number;
    titleEn: string;
    projectSummary: IProjectConcept;
    frmGroup: FormGroup;
    uuid: any;
    mtbfObj: any;
    mtbfFiscalYearModelList: MtbfFiscalYearDetailsListModel[] = new Array<MtbfFiscalYearDetailsListModel>();
    mtbFmodel: MtbfModel = new  MtbfModel ;
    res: { fiscalYear: string; }[];
    agencyModel: any;

    mtbfFiscalYearDetailList: Array<{
        id: number, fiscalYear: string,
        resourcesInFiveYearPlan: string,
        allocationAndProjection: string,
        allocationRequiredForProject: string,
        allocationOfApprovedProject: string,
        allocationOfRecommendedProject: string,
        allocationRequiredForProposedProject: string,
        totalRequirementOfAllocation: string,
        fiscalSpace: string, uuid: string
    }> = [];

    mtbfFiscalYearList: any;

    rows: FormArray = this.formBuilder.array([]);

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private formBuilder: FormBuilder,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private projectSummaryService: ProjectSummaryService,
                private dppMtbfService: MtbfService,
                private _translateService: TranslateService,
                private annualPhasingCostService: DppAnnualPhasingCostService,
                private agencyService: AgencyService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.projectConceptUuid = this.route.snapshot.params['id'];
        this.formInitialize();
        this.getProjectConceptById();
    }

    formInitialize() {
        this.frmGroup = this.formBuilder.group({
            numberOfApprovedProject: ['', Validators.required],
            numberOfOngoingProject: ['', Validators.required],
            costOfApprovedProject: [''],
            cumulativeExpenditure: [''],
            allocationRequiredForOngoingProject: [''],
            allocationInCurrentFiscalYear: [''],
            numberOfRecommendedProject: ['', Validators.required],
            wayOfFinancing: [''],

            mtbfFiscalYearListData: this.rows,
        })
    }

    populateForm() {
        const row = this.formBuilder.group({
            fiscalYear: [''],
            resourcesInFiveYearPlan: [''],
            allocationAndProjection: [''],
            allocationRequiredForProject: [''],
            allocationOfApprovedProject: [''],
            allocationOfRecommendedProject: [''],
            allocationRequiredForProposedProject: [''],
            totalRequirementOfAllocation: [''],
            fiscalSpace: [''],
        });
        this.rows.push(row);
    }

    setAllocationRequired() {
        const costOfApprovedProject = Number(this.frmGroup.value.costOfApprovedProject);  // 2
        const cumulativeExpenditure = Number(this.frmGroup.value.cumulativeExpenditure);  // 3
        const allocationRequiredForOngoingProject = costOfApprovedProject - cumulativeExpenditure;

        this.frmGroup.patchValue({
            allocationRequiredForOngoingProject: allocationRequiredForOngoingProject,
        });
    }

    getSummation(i: number){
        const allocationAndProjection = Number(this.frmGroup.value.mtbfFiscalYearListData[i].allocationAndProjection);  // 7
        const allocationRequiredForProject = Number(this.frmGroup.value.mtbfFiscalYearListData[i].allocationRequiredForProject);  // 8
        const allocationOfApprovedProject = Number(this.frmGroup.value.mtbfFiscalYearListData[i].allocationOfApprovedProject);  // 9a
        const allocationOfRecommendedProject = Number(this.frmGroup.value.mtbfFiscalYearListData[i].allocationOfRecommendedProject);  // 9b
        const allocationRequiredForProposedProject = Number(this.frmGroup.value.mtbfFiscalYearListData[i].allocationRequiredForProposedProject);  // 10

        const totalRequirementOfAllocation = allocationRequiredForProject + allocationOfApprovedProject + allocationOfRecommendedProject + allocationRequiredForProposedProject;
        const fiscalSpace = totalRequirementOfAllocation - allocationAndProjection;

        this.rows.controls[i].patchValue({
            totalRequirementOfAllocation :  totalRequirementOfAllocation,
            fiscalSpace : fiscalSpace
        });
    }

    get mtbfFiscalYearListData() {
        return this.frmGroup.controls['mtbfFiscalYearListData'] as FormArray;
    }

    setDataInMtbFmodel(){
        this.mtbfFiscalYearModelList = [];
        this.rows.getRawValue().forEach(e => {
            this.mtbfFiscalYearModelList.push(e);
        });
    }

    create() {
        this.setDataInMtbFmodel();
        this.mtbFmodel.projectConceptId = this.projectConceptId;
        this.mtbFmodel.projectConceptUuid = this.projectConceptUuid;
        this.mtbFmodel.numberOfOngoingProject = this.frmGroup.value.numberOfOngoingProject;
        this.mtbFmodel.costOfApprovedProject = this.frmGroup.value.costOfApprovedProject;
        this.mtbFmodel.cumulativeExpenditure = this.frmGroup.value.cumulativeExpenditure;
        this.mtbFmodel.allocationRequiredForOngoingProject = this.frmGroup.value.allocationRequiredForOngoingProject;
        this.mtbFmodel.allocationInCurrentFiscalYear = this.frmGroup.value.allocationInCurrentFiscalYear;
        this.mtbFmodel.numberOfApprovedProject = this.frmGroup.value.numberOfApprovedProject;
        this.mtbFmodel.numberOfRecommendedProject = this.frmGroup.value.numberOfRecommendedProject;
        this.mtbFmodel.wayOfFinancing = this.frmGroup.value.wayOfFinancing;

        this.dppMtbfService.createMtbf(this.mtbFmodel, this.mtbfFiscalYearModelList).subscribe(res=>{
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_SAVE, FAILED_SAVE);
            }
            this.spinner = false;
        })
    }

    update() {
        this.setDataInMtbFmodel();
        this.mtbFmodel.uuid = this.uuid;
        this.mtbFmodel.projectConceptId = this.projectConceptId;
        this.mtbFmodel.projectConceptUuid = this.projectConceptUuid;
        this.mtbFmodel.numberOfOngoingProject = this.frmGroup.value.numberOfOngoingProject;
        this.mtbFmodel.costOfApprovedProject = this.frmGroup.value.costOfApprovedProject;
        this.mtbFmodel.cumulativeExpenditure = this.frmGroup.value.cumulativeExpenditure;
        this.mtbFmodel.allocationRequiredForOngoingProject = this.frmGroup.value.allocationRequiredForOngoingProject;
        this.mtbFmodel.allocationInCurrentFiscalYear = this.frmGroup.value.allocationInCurrentFiscalYear;
        this.mtbFmodel.numberOfApprovedProject = this.frmGroup.value.numberOfApprovedProject;
        this.mtbFmodel.numberOfRecommendedProject = this.frmGroup.value.numberOfRecommendedProject;
        this.mtbFmodel.wayOfFinancing = this.frmGroup.value.wayOfFinancing;

        this.dppMtbfService.updateMtbf(this.mtbFmodel, this.mtbfFiscalYearModelList).subscribe(res=>{
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_UPDATE, FAILED_UPDATE);
            }
            this.spinner = false;
        })
    }

    onSubmit() {
        if (this.frmGroup.valid){
            this.spinner = true;
            if (this.uuid) {
                this.update();
            } else {
                this.create();
            }
        }else {
            this.snackbarHelper.openErrorSnackBarWithMessageEnBn("Please fill out all required fields.", "সমস্ত প্রয়োজনীয় তথ্য প্রদান করুন")
        }
    }

    onSubmitAndExit() {
        this.onSubmit();
        this.router.navigate(['dpp-tapp/dashboard/' + this.projectConceptUuid]);
    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.projectConceptUuid).subscribe(res => {
                if (res.isForeignAid) {
                    this._translateService.use('en');
                } else {
                    this._translateService.use('bn');
                }

                this.projectSummary = res;
                this.projectConceptId = res.id;
                this.titleEn = res.titleEn;
                this.getAgency();
                this.getDataByProjectConceptUuid();
            })
        );
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    getDataByProjectConceptUuid() {
        this.spinner = true;
        this.dppMtbfService.getByProjectConceptUuid(this.projectConceptUuid).subscribe(res => {
            this.mtbFmodel = res;
            this.mtbfObj = res;

            this.mtbfFiscalYearModelList = res.mtbfFiscalYearDetailList;
            let respone = res;
            this.uuid = res.uuid;
            this.setValueFromMtbfData(respone);
            this.setValueFromMtbfDataFiscal_Year(respone.mtbfFiscalYearDetailList);
            this.spinner = false;

            if (res.mtbfFiscalYearDetailList != null && (res.mtbfFiscalYearDetailList.length > 0)) {
                res.mtbfFiscalYearDetailList.forEach(re => {
                    const row = this.formBuilder.group({
                        uuid: re.uuid,
                        fiscalYear: re.fiscalYear,
                        resourcesInFiveYearPlan: re.resourcesInFiveYearPlan,
                        allocationAndProjection: re.allocationAndProjection,
                        allocationRequiredForProject: re.allocationRequiredForProject,
                        allocationOfApprovedProject: re.allocationOfApprovedProject,
                        allocationOfRecommendedProject: re.allocationOfRecommendedProject,
                        allocationRequiredForProposedProject: re.allocationRequiredForProposedProject,
                        totalRequirementOfAllocation: re.totalRequirementOfAllocation,
                        fiscalSpace: re.fiscalSpace
                    });
                    this.rows.push(row);
                })
            }
        })
    }

    setValueFromMtbfData(respone: any) {
        this.frmGroup.patchValue({
            numberOfApprovedProject: respone.numberOfApprovedProject,
            numberOfOngoingProject: respone.numberOfOngoingProject,
            costOfApprovedProject: respone.costOfApprovedProject,
            cumulativeExpenditure: respone.cumulativeExpenditure,
            allocationRequiredForOngoingProject: respone.allocationRequiredForOngoingProject,
            allocationInCurrentFiscalYear: respone.allocationInCurrentFiscalYear,
            numberOfRecommendedProject: respone.numberOfRecommendedProject,
            wayOfFinancing: respone.wayOfFinancing,
        });
    }

    setValueFromMtbfDataFiscal_Year(respone: any) {
        this.mtbfFiscalYearDetailList = [];
        respone.forEach(re => {
            this.frmGroup.patchValue({
                uuid: respone.uuid,
                fiscalYear: respone.fiscalYear,
                resourcesInFiveYearPlan: respone.resourcesInFiveYearPlan,
                allocationAndProjection: respone.allocationAndProjection,
                allocationRequiredForProject: respone.allocationRequiredForProject,
                allocationOfApprovedProject: respone.allocationOfApprovedProject,
                allocationOfRecommendedProject: respone.allocationOfRecommendedProject,
                allocationRequiredForProposedProject: respone.allocationRequiredForProposedProject,
                totalRequirementOfAllocation: respone.totalRequirementOfAllocation,
                fiscalSpace: respone.fiscalSpace,
            });
            this.mtbfFiscalYearDetailList.push(re);
        });
    }

    goBackToHome() {
        window.history.back();
    }
}
