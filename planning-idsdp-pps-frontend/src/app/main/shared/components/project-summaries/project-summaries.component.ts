import { Component, OnInit } from '@angular/core';
import {
    locale as lngEnglish
} from "./i18n/en";
import {
    locale as lngBangla
} from "./i18n/bn";
import {FuseTranslationLoaderService} from "../../../core/services/translation-loader.service";
import {UtilsService} from "../../../core/services/utils.service";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../core/constants/editor-config";
import {BehaviorSubject} from "rxjs";
import {
    DppAnnexureGoodsIiiAService
} from "../../../modules/dpp-tapp-management/services/dpp-annexure-goods_iii_a.service";
import {IProjectConcept} from "../../../modules/project-concept-management/models/project-concept";
import {NumberPipe} from "../../pipes/number-pipe.pipe";
import {ProjectSummaryService} from "../../../modules/project-concept-management/services/project-summary.service";
import {
    TappSupportStuffModel
} from "../../../modules/dpp-tapp-management/models/tapp-qualification-support-staff.model";
import {TappStuffModel} from "../../../modules/dpp-tapp-management/models/tapp-support-staff.model";
import {ProjectSummariesModels} from "../../model/project-summaries.model";
import {YearWieseCostModel} from "../../model/year-wiese-cost.model";
import {ERROR, OK} from "../../../core/constants/message";
import {ProjectSummariesService} from "../../services/project-summaries.service";
import {ActivatedRoute} from "@angular/router";
import {SnackbarHelper} from "../../../core/helper/snackbar.helper";
import {UserGroupService} from "../../../modules/configuration-management/services/user-group.service";
import {UtilityFunctionsService} from "../../../../global/functions/utility-functions.service";
import {ProjectMovementService} from "../../../modules/dpp-tapp-management/services/project-movement.service";
import {DppObjectiveCostService} from "../../../modules/dpp-tapp-management/services/dpp-objective-cost.service";
import { reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';
import {
    IDppAnnualPhasingEstimatedCostTabDetails
} from "../../../modules/dpp-tapp-management/models/dpp-annual-phasing-estimated-cost-tab-details";
import {IDppAnnexure5ACostTotal} from "../../../modules/dpp-tapp-management/models/dpp-annexure5A-cost-total";
import {DppAnnualPhasingConstant} from "../../../modules/dpp-tapp-management/constants/dpp-annual-phasing.constant";
import {
    DppAnnualPhasingCostService
} from "../../../modules/dpp-tapp-management/services/dpp-annual-phasing-cost.service";
import {
    IDppLocationWiseCostBreakdown
} from "../../../modules/dpp-tapp-management/models/dpp-location-wise-cost-breakdown.model";
import {DivisionModel} from "../../../modules/configuration-management/models/division.model";
import {DppLocationService} from "../../../modules/dpp-tapp-management/services/dpp-location.service";
import {UpazillaModel} from "../../../modules/configuration-management/models/upazilla.model";
import {ZillaModel} from "../../../modules/configuration-management/models/zilla.model";
import {
    DevelopmentPartnerService
} from "../../../modules/configuration-management/services/developmentPartnerService.service";
import moment from "moment";

@Component({
  selector: 'app-project-summaries',
  templateUrl: './project-summaries.component.html',
  styleUrls: ['./project-summaries.component.scss']
})
export class ProjectSummariesComponent implements OnInit {

    projectUuid = this.route.snapshot.params['id'];
    selectedLanguage: any;
    formGroup: FormGroup;
    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;
    spinner: boolean;
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
    editor16 = false;
    editor17 = false;
    editor18 = false;
    editor19 = false;
    editor20 = false;
    editor21 = false;

    dateOfReconstituted: Date;
    summariesCreateDate: Date;

    isSave: boolean = true;
    isUpdate: boolean = false;
    projectSummariesData:any;
    isForeignAid: boolean;

    userGroup: {
        'groupStatus': null,
        'userId': null
    };

    rows: FormArray = this.fb.array([]);
    dataSource = new BehaviorSubject<AbstractControl[]>([]);
    data = []

    summariesModel: ProjectSummariesModels = new ProjectSummariesModels();
    costModel: YearWieseCostModel[] = new Array<YearWieseCostModel>();

    fiscalYearsList: Array<{
        fiscalYear: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
        ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
    }> = [];
    annexure5b: any;
    projectSummary: IProjectConcept;
    expCommencementDate: any;
    expCommencementDate2:any;
    expCompletionDate: any;
    initValue : number = 0;
    summariesForm: boolean;
    summariesType: string;
    agencyName: string;
    ministryDivisionName: string;
    isSummaries1 : boolean = false;
    isSummaries2 : boolean = false;
    isSummaries3 : boolean = false;
    isSpec: boolean = false;
    isPec: boolean = false;
    isCurrentStage: boolean = false;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalTotal: IDppAnnexure5ACostTotal;
    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel, zilla: ZillaModel, division: DivisionModel}[] = [];

    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    blankVal: any = 0;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    grantTotal: IDppAnnexure5ACostTotal;
    developmentPartnersList = [];


    constructor(
        private fb: FormBuilder,
        private annxFiveBService: DppAnnexureGoodsIiiAService,
        private numberPipe: NumberPipe,
        private projectSummaryService: ProjectSummaryService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private utilsService: UtilsService,
        private utility : UtilityFunctionsService,
        private route: ActivatedRoute,
        private locationService: DppLocationService,
        private userGroupService: UserGroupService,
        private snackbarHelper: SnackbarHelper,
        private movementService : ProjectMovementService,
        private dppObjectivesService : DppObjectiveCostService,
        private projectSummariesService : ProjectSummariesService,
        private annualPhasingCostService: DppAnnualPhasingCostService,
        private developmentPartnerService: DevelopmentPartnerService,
    ) {
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
      this.selectedLanguage = _fuseTranslationLoaderService.getActiveLang();
  }


    ngOnInit(): void {
        this.loadForm();
        this.getProjectSummary();
        this.getUserGroup();
    }
    private getLocationByObjectCostId(pcId) {
        this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(pcId).subscribe(res => {
            if (res) {
                this.locations = res;
                this.arrangeData(pcId, res);
            }
        }, _ => {
        })
    }

    private arrangeData(pcId, res) {
        let di = 0;
        res.divisions.forEach(division => {
            let zi = 0;
            let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

            if(division && division.zillaList.length==0){
                this.createViewList(pcId, res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
            }

            division.zillaList.forEach(zilla => {
                let ui = 0;

                if(zilla && zilla.upaZillaList.length==0){
                    this.createViewList(pcId, res.dppMasterId, division, zilla, null, di, zi, ui, upazilaUnderDivision);
                }

                zilla.upaZillaList.forEach(upazila => {
                    this.createViewList(pcId, res.dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision);
                    ui += 1;
                });
                zi += 1;
            });
            di += 1;
        });
    }

    createViewList(pcId, dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision){
        const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di +1) : di +1);
        let lwc:IDppLocationWiseCostBreakdown;
        if(upazila){
            lwc = this.locationWiseCost.find(f => f.upazilaId === upazila.id);
        } else if(zilla){
            lwc = this.locationWiseCost.find(f => f.zillaId === zilla.id);
        } else if(division){
            lwc = this.locationWiseCost.find(f => f.divisionId === division.id);
        }

        this.upazilas.push(
            {
                location: {
                    uuid: lwc ? lwc?.uuid : null,
                    id: lwc ? lwc?.id : null,
                    dppMasterId: dppMasterId,
                    divisionId: division?.id,
                    zillaId: zilla?.id,
                    upazilaId: upazila?.id,
                    projectConceptMasterId: pcId,
                    projectConceptMasterUuid: this.projectUuid,
                    comment: lwc ? lwc?.comment : '',
                    estimatedCost: lwc ? lwc.estimatedCost : 0,
                    quantity: lwc ? lwc?.quantity : '',
                },
                sl: serial,
                dSpan: this.calDSpan(division, zilla, upazila, zi, ui), //((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
                zSpan: this.calZSpan(zilla,ui), //((ui === 0) ? (division.zillaList[zi].upaZillaList.length) : 0),
                upazila: upazila,
                division: division,
                zilla: zilla,

            }
        );


        console.log('Loc: '+this.upazilas);
    }

    calDSpan(division, zilla, upazila, zi, ui){
        let dRowSpan = 0;
        if(zi==0 && ui ==0){
            if (zilla){
                division?.zillaList.forEach(element => {
                    dRowSpan +=element.upaZillaList.length == 0?1:element.upaZillaList.length;
                })
            }else {
                dRowSpan = 1
            }
        }else if (zi==0 && !ui){
            dRowSpan = division?.zillaList.length;
        } else{
            dRowSpan = 0;
        }
        return dRowSpan;
    }

    calZSpan(zilla,ui){
        let zRowSpan;
        if (ui === 0){
            if (zilla==null){
                zRowSpan = 1;
            }else if(zilla?.upaZillaList.length==0){
                zRowSpan = 1;
            }else{
                zRowSpan = zilla?.upaZillaList.length;
            }
        }else {
            zRowSpan = 0;
        }
        return zRowSpan;
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        });
    }

    loadForm(){
        this.formGroup = this.fb.group({
            id: [],
            uuid: [],
            createdBy: [],
            createdOn: [],
            isDeleted: [],
            projectUuid: [],
            descriptionAndLogicality: [],
            mainActivities: [],
            projectConsistency: [],
            locationLogicality: [],
            locationAndAllocation: [],
            projectLocationAndAllocationADB: [],
            feasibilityStudy: [],
            pictureOfRealWork: [],
            pecMeetingDate: [],
            analysisOfIncome: [],
            ongoingAnnualProgramsAllocations: [],
            proposedCoreActivities: [],
            projectReasonOfCorrections: [],
            recommendationOfPecMeeting: [],
            othersInformation: [],
            opinionsAndRecommendations: [],
            summariesType: [],

            specRecomendationMeeting: [],
            projectObjectives: [],
            decesionPecMeeting: [],
            dateOfReceptDpp: [],
            projectApprovalTerms: [],
            summariesCreateDate: [],

            yearWiseCostList: this.rows,
        });
    }

    /*
    ********* Populate Form
     */
    populateForm(){
        const row = this.fb.group({
            uuid: [''],
            projectUuid: [''],
            fiscalYear: [''],
            developmentPartnerApprovedDpp: [],
            developmentPartnerAdp: [],
            ownFundApproveDpp: [],
            ownFundAdp: [],
            gobApprovedDpp: [],
            gobAdp: [],
            totalDpp: [],
            totalAdp: [],
        });
        this.rows.push(row);
        this.updateView();
    }

    /*
    ********* For empty support stuff table
     */
    emptyTable(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }


    /*
    ********* Set data for support stuff table
     */
    setDataInCostModel(){
        this.costModel = [];
        this.rows.getRawValue().forEach(e => {
            this.costModel.push(e);
        });
    }

    setSupprotStuff(res: any){
        this.formGroup.patchValue({
            gobFund: res.gobFund,
            rpaFund: res.rpaFund,
            dpaFund: res.dpaFund,
            others: res.others,
        })
    }



    updateView(): any {
        this.dataSource.next(this.rows.controls);
    }

    get yearWiseCostList() {
        return this.formGroup.controls['yearWiseCostList'] as FormArray;
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
    toggleShow11= () => this.editor11 = this.editor11 = !this.editor11;
    toggleShow12= () => this.editor12 = this.editor12 = !this.editor12;
    toggleShow13= () => this.editor13 = this.editor13 = !this.editor13;
    toggleShow14= () => this.editor14 = this.editor14 = !this.editor14;
    toggleShow15= () => this.editor15 = this.editor15 = !this.editor15;
    toggleShow16= () => this.editor16 = this.editor16 = !this.editor16;
    toggleShow17= () => this.editor17 = this.editor17 = !this.editor17;
    toggleShow18= () => this.editor18 = this.editor18 = !this.editor18;
    toggleShow19= () => this.editor19 = this.editor19 = !this.editor19;
    toggleShow20= () => this.editor20 = this.editor20 = !this.editor20;
    toggleShow21= () => this.editor21 = this.editor21 = !this.editor21;


    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.formGroup, files, propertyName);
    }
    getProjectSummary() {
        this.projectSummaryService.getByUuid(this.projectUuid).subscribe(res => {
            this.isSave = true;
            this.isUpdate = false;
            this.projectSummary = res;

            this.expCommencementDate = this.numberPipe.convertToBanglaNumber(moment(res.expCommencementDate.toString()).format('DD-MM-YYYY'));
            this.expCompletionDate = this.numberPipe.convertToBanglaNumber(moment(res.expCompletionDate.toString()).format('DD-MM-YYYY'));
            
            this.annexure5bData(res.id);
            this.getDppMasterData(res.id, res.uuid);
            this.getDetailsEstimatedCost(res.uuid);
        })
    }

    getDetailsEstimatedCost(conceptUuid) {
        this.annualPhasingCostService.getDetailsEstimatedCost(conceptUuid).subscribe(res => {
            res.dppAnnualPhasingCostDTOList.forEach(e => {
                if (e.componentName === DppAnnualPhasingConstant.Revenue_Component) {
                    this.revenueList = e.estimatedCostTabDetailsDTOS;
                    this.revenueTotal = e.dppAnnualPhasingCostTotal;
                } else if (e.componentName === DppAnnualPhasingConstant.Capital_Component) {
                    this.capitalList = e.estimatedCostTabDetailsDTOS;
                    this.capitalTotal = e.dppAnnualPhasingCostTotal;
                } else if (e.componentName === DppAnnualPhasingConstant.Contingency) {
                    this.physicalContingencyTotal = e.estimatedCostTabDetailsDTOS[0];
                    this.priceContingencyTotal = e.estimatedCostTabDetailsDTOS[1];
                }
            });
            this.grantTotal = res.grandTotalResponses;
        });
    }

    getDppMasterData(pcId, pcUuid: string){
        this.dppObjectivesService.getByProjectConceptUuid(pcUuid).subscribe(res =>{
            this.getProjectCurrentStage(res.res.id, 'DPP');
            this.getLocationByObjectCostId(pcId);
            this.agencyName = res.res.implementingAgency;
            this.ministryDivisionName = res.res.ministryDivision;
            this.getDevelopmentPartnersList(res.res.developmentPartnersList);
        })
    }

    getDevelopmentPartnersList(devList) {
        this.developmentPartnerService.fetchActiveDevelopmentList().subscribe(res => {
            this.developmentPartnersList = [];
            for (let i = 0; i < res.length; i++) {
                if (devList!=null) {
                    for (let j = 0; j < devList.length; j++) {
                        if (res[i].id===devList[j].devPartnerId) {
                            this.developmentPartnersList.push({
                                id: res[i].id,
                                name: res[i].developmentPartnerName,
                                nameBn: res[i].developmentPartnerNameBng
                            });
                        }
                    }
                }
            }
        })
    }

    annexure5bData(pcId) {
        this.annxFiveBService.getAnnexure5bData(pcId).subscribe((res) => {
            if(res) {
                this.annexure5b = res;
                this.rows.clear();
                let fiscalYear = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].grandTotal;
                if (fiscalYear.length > 0) {
                    this.fiscalYearsList = [];
                    for (let k = 0; k < fiscalYear.length; k++) {
                        this.fiscalYearsList.push({
                            fiscalYear: (fiscalYear[k].fiscalYear),
                            govAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.gobAmount),
                            govFeAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.gobFeAmount),
                            rpaAmount: ((fiscalYear[k].dppAnnualPhasingCostTotal.gobThruAmount + fiscalYear[k].dppAnnualPhasingCostTotal.spAcAmount)),
                            dpaAmount: ((fiscalYear[k].dppAnnualPhasingCostTotal.thruPdAmount + fiscalYear[k].dppAnnualPhasingCostTotal.thruDpAmount)),
                            ownFundAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.ownFundAmount),
                            ownFundFeAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.ownFundFeAmount),
                            otherAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.otherAmount),
                            otherFeAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.otherFeAmount),
                            totalAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.totalAmount),
                        });
                    }

                        if (this.fiscalYearsList.length > 0) {
                            this.fiscalYearsList.forEach(re => {
                                const row = this.fb.group({
                                    projectUuid: this.projectUuid,
                                    fiscalYear: re.fiscalYear,
                                    gobApprovedDpp: (re.govAmount/100).toFixed(2),
                                    developmentPartnerApprovedDpp: (re.rpaAmount/100).toFixed(2),
                                    ownFundApproveDpp: (re.ownFundAmount/100).toFixed(2),
                                    othersDpp: (re.otherAmount/10).toFixed(2),
                                    totalDpp: ((re.govAmount + re.ownFundAmount + re.rpaAmount + re.dpaAmount)/100).toFixed(2),
                                    developmentPartnerAdp: this.initValue.toFixed(2),
                                    ownFundAdp: this.initValue.toFixed(2),
                                    gobAdp: this.initValue.toFixed(2),
                                    totalAdp: this.initValue.toFixed(2),
                                });
                                this.rows.push(row);
                            })
                    }

                }

            }
        })
    }

    onSubmit() {
        this.setDataInCostModel();
        this.projectSummariesService.createProjectSummaries(this.formGroup.value).subscribe(res =>{
            if(res.projectUuid){
                this.snackbarHelper.openSuccessSnackBarWithMessage("Data Save Successfully", "OK");
                this.getProjectSummaries(res.projectUuid, res.summariesType);
            }
            })
    }

    onSubmitUpdate() {
        this.setDataInCostModel();
        this.projectSummariesService.updateProjectSummaries(this.formGroup.value, this.projectUuid, this.summariesType).subscribe(res =>{
            this.snackbarHelper.openSuccessSnackBarWithMessage("Data Update Successfully", "OK");
            this.getProjectSummaries(res.projectUuid, res.summariesType);
        })
    }

    getProjectSummaries(projectUuid, summariesType){
        this.projectSummariesService.getProjectSummaries(projectUuid, summariesType).subscribe(res =>{
            if(res.status == 0) {
                this.isSave = true;
                this.isUpdate = false;
                this.getProjectSummary();
            } else {
                this.isSave = false;
                this.isUpdate = true;
                const projetSummaries = res.res;
                this.projectSummariesData = projetSummaries;
                this.setProjectSummaries(projetSummaries);
                this.summariesType = projetSummaries.summariesType;
                const yearWiseCost = projetSummaries.yearWiseCostList;
                this.rows.clear();
                yearWiseCost.forEach(re =>{
                    const row = this.fb.group({
                        createdBy: re.createdBy,
                        createdOn: re.createdOn,
                        isDeleted: re.isDeleted,
                        id: re.id,
                        uuid: re.uuid,
                        projectUuid: re.projectUuid,
                        fiscalYear: re.fiscalYear,
                        gobApprovedDpp: (re.gobApprovedDpp/100).toFixed(2),
                        developmentPartnerApprovedDpp: (re.developmentPartnerApprovedDpp/100).toFixed(2),
                        ownFundApproveDpp: (re.ownFundApproveDpp/100).toFixed(2),
                        othersDpp: re.othersDpp ? (re.othersDpp/100).toFixed(2) : 0,
                        totalDpp: (re.totalDpp/100).toFixed(2),
                        developmentPartnerAdp: re.developmentPartnerAdp.toFixed(2),
                        ownFundAdp: re.ownFundAdp.toFixed(2),
                        gobAdp: re.gobAdp.toFixed(2),
                        totalAdp: re.totalAdp.toFixed(2),
                    });
                    this.rows.push(row);
                })
            }

        }, error => {

        })
    }

    onChangePaperType($event): void {
        if($event.value == 'select'){
            this.summariesForm = false;
        }
        if($event.value && $event.value != 'select'){
            if($event.value == 'FOR_ECNEC_DPP_TAPP' || $event.value == 'FOR_PLANCOM_DPP'){
                this.isSummaries1 = true;
                this.isSummaries2 = false;
                this.isSummaries3 = false;
                this.isSpec = false;
                this.isPec = false;
                this.getProjectSummaries(this.projectUuid, $event.value)
            }

            if($event.value == 'FOR_PLANCOM_FS'||
                $event.value == 'FOR_MINISTRY_FS'
            ){
                this.isSummaries1 = false;
                this.isSummaries2 = true;
                this.isSummaries3 = false;
                this.isSpec = false;
                this.isPec = true;
                this.getProjectSummaries(this.projectUuid, $event.value)
            }
            if($event.value == "FOR_PLANCOM_DPP_TAPP"){
                this.isSummaries1 = false;
                this.isSummaries2 = false;
                this.isSummaries3 = true;
                this.isSpec = false;
                this.isPec = false;
                this.getProjectSummaries(this.projectUuid, $event.value)
            }
            if($event.value == "FOR_PLANCOM_TAPP" ||
                $event.value == "FOR_MINISTRY_TAPP"){
                this.isSummaries1 = false;
                this.isSummaries2 = true;
                this.isSummaries3 = false;
                this.isSpec = true;
                this.isPec = false;
                this.getProjectSummaries(this.projectUuid, $event.value)
            }
            this.summariesForm = true;
            this.formGroup.reset();
            this.formGroup.patchValue({
                summariesType: $event.value,
                projectUuid : this.projectUuid
            })
        }
    }

    setProjectSummaries(res){
            this.formGroup.patchValue({
                id: res.id,
                uuid: res.uuid,
                createdBy: res.createdBy,
                createdOn: res.createdOn,
                isDeleted: res.isDeleted,
                projectUuid: res.projectUuid,
                descriptionAndLogicality: res.descriptionAndLogicality,
                mainActivities: res.mainActivities,
                projectConsistency: res.projectConsistency,
                locationLogicality: res.locationLogicality,
                locationAndAllocation: res.locationAndAllocation,
                projectLocationAndAllocationADB: res.projectLocationAndAllocationADB,
                feasibilityStudy: res.feasibilityStudy,
                pictureOfRealWork: res.pictureOfRealWork,
                pecMeetingDate: res.pecMeetingDate,
                analysisOfIncome: res.analysisOfIncome,
                ongoingAnnualProgramsAllocations: res.ongoingAnnualProgramsAllocations,
                proposedCoreActivities: res.proposedCoreActivities,
                projectReasonOfCorrections: res.projectReasonOfCorrections,
                recommendationOfPecMeeting: res.recommendationOfPecMeeting,
                othersInformation: res.othersInformation,
                opinionsAndRecommendations: res.opinionsAndRecommendations,
                specRecomendationMeeting: res.specRecomendationMeeting,
                projectObjectives: res.projectObjectives,
                decesionPecMeeting: res.decesionPecMeeting,
                dateOfReceptDpp: res.dateOfReceptDpp,
                projectApprovalTerms: res.projectApprovalTerms,
                summariesCreateDate: res.summariesCreateDate,
                summariesType: res.summariesType
            })
    }

    downloadSummery($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['isForeignAid'] = (this.isForeignAid) ? 1 : 0;
        this.data['projectSummary_1'] = JSON.stringify(this.projectSummary);
        this.data['projectSummary'] = JSON.stringify(this.projectSummariesData);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['sectorName'] = localStorage.getItem('sectorName') || '';
        this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);
        this.data['upazilas'] = JSON.stringify(this.upazilas);
        this.data['agencyName'] = JSON.stringify(this.agencyName);
        this.data['ministryDivisionName'] = JSON.stringify(this.ministryDivisionName);
        this.data['revenueList'] = JSON.stringify(this.revenueList);
        this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
        this.data['capitalList'] = JSON.stringify(this.capitalList);
        this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
        this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal'] = JSON.stringify(this.grantTotal);
        this.data['userType'] = this.userGroup.groupStatus;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    getProjectCurrentStage(dppMasterId: number, projectType: string){
        this.movementService.getCurrentStage(dppMasterId, projectType).subscribe(res =>{
            if(res.res.currentStage === 'APPROVED_BY_PLANNING_MINISTER'){
                this.isCurrentStage = true;
            }
        })
    }


    backToHome() {
        window.history.back();
    }

    bnMonth($month){
        let monthList = ['জানুয়ারি', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগষ্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    }
}
