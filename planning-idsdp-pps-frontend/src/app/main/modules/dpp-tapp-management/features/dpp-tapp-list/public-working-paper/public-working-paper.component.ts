import { Component, OnInit } from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {
    EMPTY_EDITOR_CONFIG
} from "../../../../../core/constants/editor-config";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {IProjectConcept} from "../../../../project-concept-management/models/project-concept";
import {PscWorkingPlanModel} from "../../../models/psc-working-plan.model";
import {DppObjectiveCostModel} from "../../../models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../models/tappObjectiveCost.model";
import {IDppLocationWiseCostBreakdown} from "../../../models/dpp-location-wise-cost-breakdown.model";
import {DivisionModel} from "../../../../configuration-management/models/division.model";
import {ZillaModel} from "../../../../configuration-management/models/zilla.model";
import {UpazillaModel} from "../../../../configuration-management/models/upazilla.model";
import {IDppAnnexure5ACostTotal} from "../../../models/dpp-annexure5A-cost-total";
import {IDppAnnualPhasingEstimatedCostTabDetails} from "../../../models/dpp-annual-phasing-estimated-cost-tab-details";
import {UtilsService} from "../../../../../core/services/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {TappObjectiveCostService} from "../../../services/tapp-objective-cost.service";
import {DppAnnualPhasingCostService} from "../../../services/dpp-annual-phasing-cost.service";
import {TappAnnualPhasingCostService} from "../../../services/tapp-annual-phasing-cost.service";
import {ProjectSummaryService} from "../../../../project-concept-management/services/project-summary.service";
import {DppLocationWiseCostBreakdownService} from "../../../services/dpp-location-wise-cost-breakdown.service";
import {DppLocationService} from "../../../services/dpp-location.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {PscWorkingPlanService} from "../../../services/psc-working-plan.service";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {locale as lngEnglish} from "../detailed-estimated-cost/i18n/en";
import {locale as lngBangla} from "../detailed-estimated-cost/i18n/bn";
import {
    OK,
} from "../../../../../core/constants/message";
import {DppAnnualPhasingConstant} from "../../../constants/dpp-annual-phasing.constant";
import {reportBackend} from "../../../../../../../environments/environment";
import * as bl2Js from 'bl2-js-report';

@Component({
  selector: 'app-public-working-paper',
  templateUrl: './public-working-paper.component.html',
  styleUrls: ['./public-working-paper.component.scss']
})
export class PublicWorkingPaperComponent extends UnsubscribeAdapterComponent implements OnInit {

    emptyEditorConfig: any = EMPTY_EDITOR_CONFIG;
    form: FormGroup;
    frmGroup: FormGroup;
    lbl6: boolean = true;
    lbl7: boolean = true;
    lbl8: boolean = true;
    lbl9: boolean = true;
    lbl10: boolean = true;
    lbl11ka: boolean = true;
    lbl11kha: boolean = true;
    lbl11ga: boolean = true;
    lbl11gha: boolean = true;
    lbl11umo: boolean = true;
    lbl11cha: boolean = true;

    conceptId: string;
    conceptUId: number;
    conceptUuid: string;

    projectSummary: IProjectConcept;
    pscWorkingPlan: PscWorkingPlanModel;
    objectiveCost: DppObjectiveCostModel | TappObjectiveCostModel;
    grandGob: number = 0;
    grandGobFe: number = 0;
    grandPa: number = 0;
    grandPaRpa: number = 0;
    grandOwnFund: number = 0;
    grandOwnFundFe: number = 0;
    grandOthers: number = 0;
    grandOthersFe: number = 0;
    show = true;

    // project location
    locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
    locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };
    upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown,zilla: ZillaModel, upazila: UpazillaModel, division: DivisionModel  }[] = [];
    pscPaperType: boolean = true;
    paperType: string;
    userGroup: {
        'groupStatus': null,
        'userId': null
    };

    isForeignAid: boolean;
    revenueTotal: IDppAnnexure5ACostTotal;
    capitalTotal: IDppAnnexure5ACostTotal;
    grantTotal: IDppAnnexure5ACostTotal;
    revenueList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    capitalList: IDppAnnualPhasingEstimatedCostTabDetails [] = [];
    physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
    blankVal: 0;
    commencementDate: Date;
    completionDate: Date;
    year: number;
    month: number;
    isLoading: boolean = false;
    data: any = {};
    agencyModel: any;
    tappModeFinanceDTO: any;

    constructor(
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private dppObjectiveCostService: DppObjectiveCostService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private dppAnnualPhasingCostService: DppAnnualPhasingCostService,
        private tappAnnualPhasingCostService: TappAnnualPhasingCostService,
        private projectSummaryService: ProjectSummaryService,
        private costBreakdownService: DppLocationWiseCostBreakdownService,
        private locationService: DppLocationService,
        public numberPipe: NumberPipe,
        private snackbarHelper: SnackbarHelper,
        private userGroupService: UserGroupService,
        private pscWorkingPlanService: PscWorkingPlanService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private agencyService: AgencyService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        let url_string = window.location.href;
        let url = new URL(url_string);
        this.conceptId = url.searchParams.get("id");
        let storeSessionId = url.searchParams.get("p");
        if(storeSessionId) {
            this.router.navigateByUrl('/dpp-tapp/public-psc?id='+this.conceptId);
        }

        this.populateForm();
        this.getUserGroups();
        this.frmGroup = this.formBuilder.group({
            pscWorkingPaperType: ['select'],
        });
        this.route.params.subscribe(params => {
            // this.conceptId = params['id'];
            this.getProjectConceptById();
        });
        this.getPscWorkingPlan('PSC');
    }

    getUserGroups() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        });
    }

    private getProjectConceptById() {
        this.subscribe$.add(
            this.projectSummaryService.getByUuid(this.conceptId).subscribe(res => {
                    this.projectSummary = res;
                    if (res.projectTypeDTO.nameEn.toLowerCase() === 'dpp') {
                        this.getDppObjectiveAndCostByProjectConceptId();
                        this.getDppGrandTotal(res.id);
                        this.getByLocationWiseCostProjectConceptMasterId(res.id);
                    } else {
                        this.getTappGrandTotal(res.id);
                        this.getTappObjectiveAndCostByProjectConceptId();
                    }
                    this.getAgency();
                }
            )
        );
    }

    private getAgency() {
        this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
            this.agencyModel = res;
        })
    }

    private getPscWorkingPlan(paperType) {
        this.subscribe$.add(
            this.pscWorkingPlanService.getByPcId(this.conceptId, paperType, 'MINISTRY-DESK').subscribe(res => {
                    if (res) {
                        this.pscWorkingPlan = null;
                        this.pscWorkingPlan = res;
                        this.setPscWorkingPlanData(res);
                    }
                    this.getAll();
                    if(res == null){
                        this.form.patchValue({
                            projectPurpose: this.objectiveCost.objectivesTargets ? this.objectiveCost.objectivesTargets : this.projectSummary.objectivesBn
                        });
                    }
                }
            )
        );
    }

    private getDppObjectiveAndCostByProjectConceptId() {
        this.subscribe$.add(
            this.dppObjectiveCostService.getByProjectConceptUuid(this.conceptId).subscribe(res => {
                    this.objectiveCost = res.res;
                    console.log(" this.objectiveCost",  this.objectiveCost);
                    this.totalModeOfFinance(res);


                    const diffDays = (startDate, endDate) => Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
                    const totalDays: number = diffDays(new Date(res.res.dateCommencement), new Date(res.res.dateCompletion));
                    this.year = Math.floor(totalDays / 365);
                    this.month = Math.floor((totalDays % 365) / 30);
                }
            )
        );
    }

    private getByLocationWiseCostProjectConceptMasterId(id) {
        this.subscribe$.add(
            this.costBreakdownService.getByProjectConceptMasterId(id).subscribe(res => {
                this.locationWiseCost = res;
                this.getLocationByObjectCostId(id);
            })
        );
    }

    private getLocationByObjectCostId(id) {
        this.subscribe$.add(
            this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(id).subscribe(res => {
                if (res) {
                    this.locations = res;
                    this.arrangeData(res);
                } else {
                    this.show = true;
                    this.snackbarHelper.openWarnSnackBarWithMessage("Require to save Part-A (Project Summary)", OK);
                }
            }, _ => {
                this.show = true;
            })
        );
    }

    private arrangeData(res) {
        let di = 0;
        res.divisions.forEach(division => {
            let zi = 0;
            let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

            if(division && division.zillaList.length==0){
                this.createViewList(res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
            }

            division.zillaList.forEach(zilla => {
                let ui = 0;

                if(zilla && zilla.upaZillaList.length==0){
                    this.createViewList(res.dppMasterId, division, zilla, null, di, zi, ui, upazilaUnderDivision);
                }

                zilla.upaZillaList.forEach(upazila => {
                    this.createViewList(res.dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision);
                    ui += 1;
                });
                zi += 1;
            });
            di += 1;
        });

        this.show = true;
    }

    createViewList(dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision){
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
                    projectConceptMasterId: this.conceptUId,
                    projectConceptMasterUuid: this.conceptUuid,
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

    totalModeOfFinance(res) {
        this.grandGob = res.res.modeFinanceList.map(e => e.gob).reduce((sum, current) => sum + current, 0);
        this.grandGobFe = res.res.modeFinanceList.map(e => e.gobFe).reduce((sum, current) => sum + current, 0);
        this.grandPa = res.res.modeFinanceList.map(e => e.pa).reduce((sum, current) => sum + current, 0);
        this.grandPaRpa = res.res.modeFinanceList.map(e => e.paRpa).reduce((sum, current) => sum + current, 0);
        this.grandOwnFund = res.res.modeFinanceList.map(e => e.ownFund).reduce((sum, current) => sum + current, 0);
        this.grandOwnFundFe = res.res.modeFinanceList.map(e => e.ownFundFe).reduce((sum, current) => sum + current, 0);
        this.grandOthers = res.res.modeFinanceList.map(e => e.others).reduce((sum, current) => sum + current, 0);
        this.grandOthersFe = res.res.modeFinanceList.map(e => e.othersFe).reduce((sum, current) => sum + current, 0);
    }

    private getTappObjectiveAndCostByProjectConceptId() {
        this.subscribe$.add(
            this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptId).subscribe(res => {
                this.objectiveCost = res.res;
                this.show = true;

                this.tappModeFinanceDTO = res.res.tappModeFinanceDTO;
                this.totalModeOfFinance(res);
            })
        );
    }

    private setPscWorkingPlanData(res: PscWorkingPlanModel) {
        this.form.patchValue({
            id: res.id,
            uuid: res.uuid,
            projectConceptMasterId: res.projectConceptMasterId,
            projectConceptUuid: res.projectConceptUuid,
            userType: res.userType,
            pscPaperType: res.pscPaperType,
            sanctionSchedule: res.sanctionSchedule,
            projectPurpose: res.projectPurpose,
            mainActivity: res.mainActivity,
            partWiseExpense: res.partWiseExpense,
            projectReason: res.projectReason,
            analysisBackground: res.analysisBackground,
            consistencyAnalysis: res.consistencyAnalysis,
            projectPrinciple: res.projectPrinciple,
            analysisType: res.analysisType,
            rationalityAnalysis: res.rationalityAnalysis,
            relatedOtherSubjects: res.relatedOtherSubjects,
        });
    }

    private getDppGrandTotal(conceptId: number) {
        this.dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.dppAnnualPhasing == DppAnnualPhasingConstant.Grand_Total).map(e => e.dppAnnualPhasingCostTotal)[0];
                this.projectSummary.totalAmount = total[0].totalAmount;
                this.projectSummary.gobAmount = total[0].gobAmount;
                this.projectSummary.paAmount = total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount;
                this.projectSummary.ownFundAmount = total[0].ownFundAmount;
                this.projectSummary.otherAmount = total[0].otherAmount;
            }
        });
    }

    private getTappGrandTotal(conceptId: number) {
        this.tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(conceptId).subscribe(res => {
            if (res.length > 1) {
                let total = res.filter(r => r.componentName == DppAnnualPhasingConstant.Grand_Total).map(e => e.tappAnnualPhasingCostTotal)[0];
                this.projectSummary.totalAmount = total[0].totalAmount;
                this.projectSummary.gobAmount = total[0].gobAmount;
                this.projectSummary.paAmount = total[0].gobThruAmount + total[0].spAcAmount + total[0].thruDpAmount + total[0].thruPdAmount;
                this.projectSummary.ownFundAmount = total[0].ownFundAmount;
                this.projectSummary.otherAmount = total[0].otherAmount;
            }
        });
    }

    private populateForm(): void {
        this.form = new FormGroup({
            id: new FormControl(''),
            uuid: new FormControl(''),
            projectConceptMasterId: new FormControl(''),
            projectConceptUuid: new FormControl(''),
            userType: new FormControl(''),
            pscPaperType: new FormControl(''),
            sanctionSchedule: new FormControl(''),
            projectPurpose: new FormControl(''),
            mainActivity: new FormControl(''),
            partWiseExpense: new FormControl(''),
            projectReason: new FormControl(''),
            analysisBackground: new FormControl(''),
            consistencyAnalysis: new FormControl(''),
            projectPrinciple: new FormControl(''),
            analysisType: new FormControl(''),
            rationalityAnalysis: new FormControl(''),
            relatedOtherSubjects: new FormControl('')
        });
        this.show = false;
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    expand(i: number): void {
        if (i === 1) {
            this.lbl6 = true;
        } else if (i === 2) {
            this.lbl7 = true;
        } else if (i === 3) {
            this.lbl8 = true;
        } else if (i === 4) {
            this.lbl9 = true;
        } else if (i === 5) {
            this.lbl10 = true;
        } else if (i === 6) {
            this.lbl11ka = true;
        } else if (i === 7) {
            this.lbl11kha = true;
        } else if (i === 8) {
            this.lbl11ga = true;
        } else if (i === 9) {
            this.lbl11gha = true;
        } else if (i === 10) {
            this.lbl11umo = true;
        } else if (i === 11) {
            this.lbl11cha = true;
        }
    }

    collapse(i: number): void {
        if (i === 1) {
            this.lbl6 = false;
        } else if (i === 2) {
            this.lbl7 = false;
        } else if (i === 3) {
            this.lbl8 = false;
        } else if (i === 4) {
            this.lbl9 = false;
        } else if (i === 5) {
            this.lbl10 = false;
        } else if (i === 6) {
            this.lbl11ka = false;
        } else if (i === 7) {
            this.lbl11kha = false;
        } else if (i === 8) {
            this.lbl11ga = false;
        } else if (i === 9) {
            this.lbl11gha = false;
        } else if (i === 10) {
            this.lbl11umo = false;
        } else if (i === 11) {
            this.lbl11cha = false;
        }
    }

    private getAll() {
        if(this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP'){
            this.getDppDetailsEstimatedCost();
        }else{
            this.getTappDetailsEstimatedCost();
        }
    }

    private getDppDetailsEstimatedCost(){
        this.subscribe$.add(
            this.dppAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptId).subscribe(res => {
                this.arrangeAnnualPhasingCostData(res);
                this.grantTotal = res.grandTotalResponses;
            })
        );
    }

    private getTappDetailsEstimatedCost(){
        this.subscribe$.add(
            this.tappAnnualPhasingCostService.getDetailsEstimatedCost(this.conceptId).subscribe(res => {
                this.arrangeAnnualPhasingCostData(res);
                this.grantTotal = res.grandTotalResponses;
            })
        );
    }

    private arrangeAnnualPhasingCostData(data: any){
        data.dppAnnualPhasingCostDTOList.forEach(e => {
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
    }

    karjopotrro_Report() {
        this.isLoading = true;
        this.karjopotrro_Report_pdf('karjopotrro ', 'dpp/karjopotrro');
    }

    karjopotrro_Report_pdf($fileName = '', $templateName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/' + $templateName;
        this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';

        this.data['objectiveCost'] = JSON.stringify(this.objectiveCost);
        this.data['projectSummary']=JSON.stringify(this.projectSummary);

        this.data['grandGob']=JSON.stringify(this.grandGob);
        this.data['grandGobFe']=JSON.stringify(this.grandGobFe);
        this.data['grandPa']=JSON.stringify(this.grandPa);
        this.data['grandPaRpa']=JSON.stringify(this.grandPaRpa);
        this.data['grandOwnFund']=JSON.stringify(this.grandOwnFund);
        this.data['grandOwnFundFe']=JSON.stringify(this.grandOwnFundFe);
        this.data['grandOthers']=JSON.stringify(this.grandOthers);
        this.data['grandOthersFe']=JSON.stringify(this.grandOthersFe);
        this.data['tappModeFinanceDTO']=JSON.stringify(this.tappModeFinanceDTO);
        this.data['agency'] = JSON.stringify(this.agencyModel);

        this.data['pscWorkingPlan']=JSON.stringify(this.pscWorkingPlan);
        this.data['revenueList']=JSON.stringify(this.revenueList);
        this.data['capitalList']=JSON.stringify(this.capitalList);
        this.data['physicalContingencyTotal']=JSON.stringify(this.physicalContingencyTotal);
        this.data['priceContingencyTotal']=JSON.stringify(this.priceContingencyTotal);
        this.data['grantTotal']=JSON.stringify(this.grantTotal);

        this.data['upazilas']=JSON.stringify(this.upazilas);
        this.data['pscPaperType']=JSON.stringify(this.pscPaperType);
        console.log(" this.projectSummary",  this.projectSummary);

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
        this.isLoading = false;
    }
}
