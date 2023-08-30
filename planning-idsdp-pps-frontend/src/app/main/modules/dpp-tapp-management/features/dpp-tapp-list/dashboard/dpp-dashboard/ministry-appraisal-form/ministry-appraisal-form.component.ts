import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutHelperService } from 'app/layout/layouts/vertical/services/layout-helper.service';
import { MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { FAILED_SAVE, FAILED_UPDATE, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN, SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { UnsubscribeAdapterComponent } from 'app/main/core/helper/unsubscribeAdapter';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { UtilsService } from 'app/main/core/services/utils.service';
import { DivisionModel } from 'app/main/modules/configuration-management/models/division.model';
import { SectorDivisionModel } from 'app/main/modules/configuration-management/models/sector-division.model';
import { SectorModel } from 'app/main/modules/configuration-management/models/sector.model';
import { SubSectorModel } from 'app/main/modules/configuration-management/models/sub-sector.model';
import { UpazillaModel } from 'app/main/modules/configuration-management/models/upazilla.model';
import { ZillaModel } from 'app/main/modules/configuration-management/models/zilla.model';
import { AgencyService } from 'app/main/modules/configuration-management/services/agency.service';
import { SectorDivisionService } from 'app/main/modules/configuration-management/services/sector-division.service';
import { SectorService } from 'app/main/modules/configuration-management/services/sector.service';
import { SubSectorService } from 'app/main/modules/configuration-management/services/sub-sector.service';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import { DppAnnualPhasingConstant } from 'app/main/modules/dpp-tapp-management/constants/dpp-annual-phasing.constant';
import { IDppAnnexure5ACostTotal } from 'app/main/modules/dpp-tapp-management/models/dpp-annexure5A-cost-total';
import { IDppAnnualPhasingEstimatedCostTabDetails } from 'app/main/modules/dpp-tapp-management/models/dpp-annual-phasing-estimated-cost-tab-details';
import { IDppLocationWiseCostBreakdown } from 'app/main/modules/dpp-tapp-management/models/dpp-location-wise-cost-breakdown.model';
import { DppCurrencyRateModel } from 'app/main/modules/dpp-tapp-management/models/dppCurrencyRate.model';
import { DppDevelopmentPartnerModel } from 'app/main/modules/dpp-tapp-management/models/dppDevelopmentPartner.model';
import { LogFrameModel } from 'app/main/modules/dpp-tapp-management/models/logFrame.model';
import { mafsaf, MafSafModel } from 'app/main/modules/dpp-tapp-management/models/maf-saf-model.model';
import { DppAnnexureGoodsIiiAService } from 'app/main/modules/dpp-tapp-management/services/dpp-annexure-goods_iii_a.service';
import { DppAnnualPhasingCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-annual-phasing-cost.service';
import { DppLocationWiseCostBreakdownService } from 'app/main/modules/dpp-tapp-management/services/dpp-location-wise-cost-breakdown.service';
import { DppLocationService } from 'app/main/modules/dpp-tapp-management/services/dpp-location.service';
import { DppLogFrameService } from 'app/main/modules/dpp-tapp-management/services/dpp-log-frame.service';
import { DppObjectiveCostService } from 'app/main/modules/dpp-tapp-management/services/dpp-objective-cost.service';
import { DppProjectSummeryHelperService } from 'app/main/modules/dpp-tapp-management/services/dpp-project-summery-helper.service';
import { ModeOfFinanceModel } from 'app/main/modules/project-concept-management/models/mode-of-finance.model';
import { IProjectConcept } from 'app/main/modules/project-concept-management/models/project-concept';
import { ModeOfFinanceService } from 'app/main/modules/project-concept-management/services/mode-of-finance.service';
import { ProjectSummaryService } from 'app/main/modules/project-concept-management/services/project-summary.service';
import { NumberPipe } from 'app/main/shared/pipes/number-pipe.pipe';
import { MafSafService } from '../../../project-details/services/maf-saf.service';
import * as bl2Js from 'bl2-js-report';

import { locale as lngEnglish } from './i18n/bn';
import { locale as lngBangla } from './i18n/en';
import { reportBackend } from 'environments/environment';
import {OtherDetailsService} from "../../../project-details/services/other-details.service";
@Component({
  selector: 'app-ministry-appraisal-form',
  templateUrl: './ministry-appraisal-form.component.html',
  styleUrls: ['./ministry-appraisal-form.component.scss']
})
export class MinistryAppraisalFormComponent extends UnsubscribeAdapterComponent implements OnInit {
  @ViewChild('logFrameCkEditor') logFrameCkEditor: TemplateRef<any>;
  @Output() nextStep = new EventEmitter<boolean>();


  spinner: boolean;
  uuid: string;
  pcUuid: string;
  projectSummary: IProjectConcept;
  isParipatra2016: boolean = true;
  nothiStatus = 'Draft';
  isEnLabel: boolean;
  titleEn: string = "Helo";
  titleBn: string;
  commencementDate: string;
  completionDate: string;
  dppMasterId: number;
  projectConceptId: number;
  projectConceptUuid: any;
  tappMasterId: number;
  currentStage: string;
  id: number;
  agencyModel: any;
  totalAllocationByAgency: number = 0;
  isDppProjectType: boolean = false;
  userGroupModel: any;
  conceptUuid = this.activatedRoute.snapshot.params['id'];
  sectorDivision: SectorDivisionModel;

  sector: SectorModel;
  subSector: SubSectorModel;
  frmGroup: FormGroup;

  title: any;
  ckEditorData: any;

  model: LogFrameModel = new LogFrameModel();
  projectConceptMasterId: number;
  dppMasterData;

  paripatraVersion: string;
  isShowObjectivesAndTargets: boolean = true;

  currencyModel: DppCurrencyRateModel[] = new Array<DppCurrencyRateModel>();
  developmentPartnerModelList: DppDevelopmentPartnerModel[] = new Array<DppDevelopmentPartnerModel>();

  pcId: number;

  modeFinancingList: {
    modeId: number, modeSource: string, modeSourceVal: string, gob: number, gobFe: number, pa: number, paRpa: number,
    ownFund: number, ownFundFe: number, others: number, othersFe: number, paSources: string, isEdited: boolean
  }[] = [];
  lockModeFinancingList: { modeId: number, pa: number, paRpa: number, paSources: string }[] = [];

  modelOfFinanceList: ModeOfFinanceModel[] = [];
  dataSource: MatTableDataSource<ModeOfFinanceModel>;
  totalModeOfFinance: ModeOfFinanceModel;

  grandGob: any;
  grandGobFe: any;
  grandPa: any;
  grandPaRpa: any;
  grandOwnFund: any;
  grandOwnFundFe: any;
  grandOthers: any;
  grandOthersFe: any;

  show: any;
  expCompletionMinDate: Date;

  modeNameList = [
    { nameEn: 'Investment', nameBn: 'বিনিয়োগ' },
    { nameEn: 'Loan/Credit', nameBn: 'ঋণ' },
    { nameEn: 'Grant', nameBn: 'অনুদান' },
    { nameEn: 'Equity', nameBn: 'ইক্যুইটি' },
    { nameEn: 'Others(Specify)', nameBn: 'অন্যান্য' },
  ];
  modeFinanceTypeList: Array<{ id: number, name: string, isEdited: boolean, pa: number, rpa: number, devPartner: string }> = [];

  isForeignAid: boolean = false;

  userId: any;
  ministry_name: string;
  agency_name: string;

  minEditorConfig: any = MIN_EDITOR_CONFIG;
  mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;

  annexure5b: any;
  objectivesTargets: any;
  logFrame: any;
  specificationLinkagePerspective: string = '';
  blankVal : any = 0;
  projectCost = {
    gobAmount: '0',
    gobFeAmount: '0',
    paAmount: '0',
    paRpaAmount: '0',
    dpa_Amount: '0',
    ownFeAmount: '0',
    ownFundAmount: '0',
    othersAmount: '0',
    otherFeAmount: '0',
    totalAmount: '0'
  };

  fiscalYearsList: Array<{
    fiscalYear: string, govAmount: any, govFeAmount: any, rpaAmount: any, dpaAmount: any,
    ownFundAmount: any, ownFundFeAmount: any, otherAmount: any, otherFeAmount: any, totalAmount: any
  }> = [];

  revenueTotal: IDppAnnexure5ACostTotal;
  capitalTotal: IDppAnnexure5ACostTotal;
  grantTotal: IDppAnnexure5ACostTotal;
  revenueList: IDppAnnualPhasingEstimatedCostTabDetails[] = [];
  capitalList: IDppAnnualPhasingEstimatedCostTabDetails[] = [];
  physicalContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;
  priceContingencyTotal: IDppAnnualPhasingEstimatedCostTabDetails;

  upazilas: { sl: any, dSpan: number, zSpan: number, location: IDppLocationWiseCostBreakdown, upazila: UpazillaModel, zilla: ZillaModel, division: DivisionModel }[] = [];
  conceptId: number;

  locationWiseCost: IDppLocationWiseCostBreakdown[] = [];
  locations: { id: number, uuid: string, dppMasterId: number, divisions: DivisionModel[] };


  mafSafModel: MafSafModel = new MafSafModel();
  type: string;
  data: any = {};
  getAllDataMAF: any;
    userGroup: {
        'groupStatus': null,
        'userId': null
    };

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectSummaryService: ProjectSummaryService,
    private _translateService: TranslateService,
    private layoutHelperService: LayoutHelperService,
    private datePipe: DatePipe,
    public numberPipe: NumberPipe,
    private agencyService: AgencyService,
    private userGroupService: UserGroupService,
    private route: Router,
    private mafSafService: MafSafService,
    private sectorDivisionService: SectorDivisionService,
    private sectorService: SectorService,
    private subSectorService: SubSectorService,
    private locationService: DppLocationService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private logFrameService: DppLogFrameService,
    private dppHelperService: DppProjectSummeryHelperService,
    private snackbarHelper: SnackbarHelper,
    private router: Router,
    private objectiveAndCostService: DppObjectiveCostService,
    private utilsService: UtilsService,
    private modeFinanceService: ModeOfFinanceService,
    private annxGoodService: DppAnnexureGoodsIiiAService,
    private annualPhasingCostService: DppAnnualPhasingCostService,
    private service: DppLocationWiseCostBreakdownService,
    private otherDetailsService: OtherDetailsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.spinner = true;
    this.activatedRoute.params.subscribe(params => {
      this.pcUuid = params['id'];
    });
    this.getProjectSummary();
    this.getLogFrameByPcid();
    this.getObjectiveAndCostByProjectConceptId();
    this.inItForm();
    this.getAll();
    this.getUserGroup();
    this.getOtherDetails();
    this.getByUuidMaf_Saf();

    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    this.spinner = false;
  }

  inItForm() {
    this.frmGroup = this.formBuilder.group({

      isIncludedInAdpRadp: ['false'],
      isMinisterApprovedNewProject: ['false'],
      approvalDate: [new Date(), Validators.required],


      isProjectLandRequired: ['false'],
      isForeignAid: ['false'],
      projectLandDescription: [''],

      isProjectFeasibilityStudyRequired: ['false'],
      projectFeasibilityStudyRequiredDescription: [''],

      isProjectFeasibilityStudyDone: ['false'],
      projectFeasibilityStudyDoneDescription: [''],

      isEnvironmentalClearance: ['false'],
      environmentalClearanceDescription: [''],

      environmentalImpactWiseProjectCategory: [''],

      isLocatedInECA: ['false'],
      locatedInEcaDescription: [''],

      isEIA: ['false'],
      eiaDescription: [''],

      isPppNeeded: ['false'],
      pppDescription: [''],
      relevanceWithProgram: [''],
      relevanceOfTheProposal: [''],
      institutionalArrangement: [''],
      relevanceWithOtherDevelopmentProgrammes: [''],
      expectedSocioEconomicBenefits: [''],


      isFinancialEconomicAnalysis: ['false'],
      financialEconomicAnalysisDescription: [''],

      isCompensationOrRehabilitationNeeded: ['false'],
      compensationOrRehabilitationDescription: [''],

      isManpowerApproved: ['false'],
      manpowerApprovedAttachId: [''],
      sustainabilityOfTheProjectBenefit: [''],




    });
  }


  onSubmitAndExit() {
    this.onSubmit();
    this.router.navigate(['dpp-tapp/create-new-ministry-appraisal/' + this.pcUuid]);
  }


  onSubmit() {
    this.spinner = true;
    if (this.uuid) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.mafSafModel.type = mafsaf.MAF;
    if(this.userGroup?.groupStatus == 'PLANNING-DESK' || this.userGroup?.groupStatus == 'PLANNING-HEAD') {
        this.mafSafModel.type = mafsaf.SAF;
    }

    this.mafSafModel.projectConceptId = 0;
    this.mafSafModel.projectConceptUuid = this.pcUuid;

    this.mafSafModel.isIncludedInAdpRadp = this.frmGroup.value.isIncludedInAdpRadp == 'true' ? true : false;
    this.mafSafModel.isMinisterApprovedNewProject = this.frmGroup.value.isMinisterApprovedNewProject == 'true' ? true : false;
    this.mafSafModel.approvalDate = this.frmGroup.value.approvalDate;
    this.mafSafModel.isProjectLandRequired = this.frmGroup.value.isProjectLandRequired == 'true' ? true : false;
    this.mafSafModel.isProjectFeasibilityStudyRequired = this.frmGroup.value.isProjectFeasibilityStudyRequired == 'true' ? true : false;
    this.mafSafModel.isProjectFeasibilityStudyDone = this.frmGroup.value.isProjectFeasibilityStudyDone == 'true' ? true : false;
    this.mafSafModel.isEnvironmentalClearance = this.frmGroup.value.isEnvironmentalClearance == 'true' ? true : false;
    this.mafSafModel.isLocatedInECA = this.frmGroup.value.isLocatedInECA == 'true' ? true : false;
    this.mafSafModel.isEIA = this.frmGroup.value.isEIA == 'true' ? true : false;
    this.mafSafModel.isPppNeeded = this.frmGroup.value.isPppNeeded == 'true' ? true : false;
    this.mafSafModel.isFinancialEconomicAnalysis = this.frmGroup.value.isFinancialEconomicAnalysis == 'true' ? true : false;
    this.mafSafModel.isCompensationOrRehabilitationNeeded = this.frmGroup.value.isCompensationOrRehabilitationNeeded == 'true' ? true : false;
    this.mafSafModel.isManpowerApproved = this.frmGroup.value.isManpowerApproved == 'true' ? true : false;

    this.mafSafModel.projectFeasibilityStudyRequiredDescription = this.frmGroup.value.projectFeasibilityStudyRequiredDescription;
    this.mafSafModel.projectFeasibilityStudyDoneDescription = this.frmGroup.value.projectFeasibilityStudyDoneDescription;
    this.mafSafModel.projectFeasibilityStudyAttachId = this.frmGroup.value.projectFeasibilityStudyAttachId;
    this.mafSafModel.environmentalClearanceDescription = this.frmGroup.value.environmentalClearanceDescription;
    this.mafSafModel.environmentalImpactWiseProjectCategory = this.frmGroup.value.environmentalImpactWiseProjectCategory;
    this.mafSafModel.locatedInEcaDescription = this.frmGroup.value.locatedInEcaDescription;
    this.mafSafModel.eiaDescription = this.frmGroup.value.eiaDescription;
    this.mafSafModel.pppDescription = this.frmGroup.value.pppDescription;
    this.mafSafModel.projectLandDescription = this.frmGroup.value.projectLandDescription;
    this.mafSafModel.relevanceWithProgram = this.frmGroup.value.relevanceWithProgram;
    this.mafSafModel.relevanceOfTheProposal = this.frmGroup.value.relevanceOfTheProposal;
    this.mafSafModel.institutionalArrangement = this.frmGroup.value.institutionalArrangement;
    this.mafSafModel.relevanceWithOtherDevelopmentProgrammes = this.frmGroup.value.relevanceWithOtherDevelopmentProgrammes;
    this.mafSafModel.expectedSocioEconomicBenefits = this.frmGroup.value.expectedSocioEconomicBenefits;
    this.mafSafModel.financialEconomicAnalysisDescription = this.frmGroup.value.financialEconomicAnalysisDescription;
    this.mafSafModel.compensationOrRehabilitationDescription = this.frmGroup.value.compensationOrRehabilitationDescription;
    this.mafSafModel.manpowerApprovedAttachId = this.frmGroup.value.manpowerApprovedAttachId;
    this.mafSafModel.sustainabilityOfTheProjectBenefit = this.frmGroup.value.sustainabilityOfTheProjectBenefit;

    this.mafSafService.createMtbf(this.mafSafModel).subscribe(res => {
      if (res.uuid) {
        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
      } else {
        this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_SAVE, FAILED_SAVE);
      }
      this.spinner = false;
      this.getByUuidMaf_Saf();
    })
  }

  update() {
    this.mafSafModel.type = mafsaf.MAF;
    if(this.userGroup?.groupStatus == 'PLANNING-DESK' || this.userGroup?.groupStatus == 'PLANNING-HEAD') {
        this.mafSafModel.type = mafsaf.SAF;
    }
    this.mafSafModel.projectConceptId = 0;
    this.mafSafModel.projectConceptUuid = this.pcUuid;

    this.mafSafModel.isIncludedInAdpRadp = this.frmGroup.value.isIncludedInAdpRadp == 'true' ? true : false;
    this.mafSafModel.isMinisterApprovedNewProject = this.frmGroup.value.isMinisterApprovedNewProject == 'true' ? true : false;
    this.mafSafModel.approvalDate = this.frmGroup.value.approvalDate;
    this.mafSafModel.isProjectLandRequired = this.frmGroup.value.isProjectLandRequired == 'true' ? true : false;
    this.mafSafModel.isProjectFeasibilityStudyRequired = this.frmGroup.value.isProjectFeasibilityStudyRequired == 'true' ? true : false;
    this.mafSafModel.isProjectFeasibilityStudyDone = this.frmGroup.value.isProjectFeasibilityStudyDone == 'true' ? true : false;
    this.mafSafModel.isEnvironmentalClearance = this.frmGroup.value.isEnvironmentalClearance == 'true' ? true : false;
    this.mafSafModel.isLocatedInECA = this.frmGroup.value.isLocatedInECA == 'true' ? true : false;
    this.mafSafModel.isEIA = this.frmGroup.value.isEIA == 'true' ? true : false;
    this.mafSafModel.isPppNeeded = this.frmGroup.value.isPppNeeded == 'true' ? true : false;
    this.mafSafModel.isFinancialEconomicAnalysis = this.frmGroup.value.isFinancialEconomicAnalysis == 'true' ? true : false;
    this.mafSafModel.isCompensationOrRehabilitationNeeded = this.frmGroup.value.isCompensationOrRehabilitationNeeded == 'true' ? true : false;
    this.mafSafModel.isManpowerApproved = this.frmGroup.value.isManpowerApproved == 'true' ? true : false;

    this.mafSafModel.projectFeasibilityStudyRequiredDescription = this.frmGroup.value.projectFeasibilityStudyRequiredDescription;
    this.mafSafModel.projectFeasibilityStudyDoneDescription = this.frmGroup.value.projectFeasibilityStudyDoneDescription;
    this.mafSafModel.projectFeasibilityStudyAttachId = this.frmGroup.value.projectFeasibilityStudyAttachId;
    this.mafSafModel.environmentalClearanceDescription = this.frmGroup.value.environmentalClearanceDescription;
    this.mafSafModel.environmentalImpactWiseProjectCategory = this.frmGroup.value.environmentalImpactWiseProjectCategory;
    this.mafSafModel.locatedInEcaDescription = this.frmGroup.value.locatedInEcaDescription;
    this.mafSafModel.eiaDescription = this.frmGroup.value.eiaDescription;
    this.mafSafModel.pppDescription = this.frmGroup.value.pppDescription;
    this.mafSafModel.relevanceWithProgram = this.frmGroup.value.relevanceWithProgram;
    this.mafSafModel.projectLandDescription = this.frmGroup.value.projectLandDescription;
    this.mafSafModel.relevanceOfTheProposal = this.frmGroup.value.relevanceOfTheProposal;
    this.mafSafModel.institutionalArrangement = this.frmGroup.value.institutionalArrangement;
    this.mafSafModel.relevanceWithOtherDevelopmentProgrammes = this.frmGroup.value.relevanceWithOtherDevelopmentProgrammes;
    this.mafSafModel.expectedSocioEconomicBenefits = this.frmGroup.value.expectedSocioEconomicBenefits;
    this.mafSafModel.financialEconomicAnalysisDescription = this.frmGroup.value.financialEconomicAnalysisDescription;
    this.mafSafModel.compensationOrRehabilitationDescription = this.frmGroup.value.compensationOrRehabilitationDescription;
    this.mafSafModel.manpowerApprovedAttachId = this.frmGroup.value.manpowerApprovedAttachId;
    this.mafSafModel.sustainabilityOfTheProjectBenefit = this.frmGroup.value.sustainabilityOfTheProjectBenefit;
    this.mafSafModel.uuid = this.uuid;
    this.mafSafService.updateMtbf(this.mafSafModel).subscribe(res => {
      if (res.uuid) {
        this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_UPDATED, SUCCESSFULLY_UPDATED_BN);
      } else {
        this.snackbarHelper.openErrorSnackBarWithMessageEnBn(FAILED_UPDATE, FAILED_UPDATE);
      }
      this.spinner = false;
      this.getByUuidMaf_Saf();
    })
  }


  getByUuidMaf_Saf() {
    this.spinner = true;
    let type = mafsaf.MAF;
    if(this.userGroup?.groupStatus == 'PLANNING-DESK' || this.userGroup?.groupStatus == 'PLANNING-HEAD') {
        type = mafsaf.SAF;
    }

    this.mafSafService.getByUuidMaf_Saf(this.pcUuid, type).subscribe(res => {
      this.getAllDataMAF = res;
      this.setValueFromObjectiveCost(res);
      if (res != null) {
        this.uuid = res.uuid;
      }

      this.spinner = false;

    }, error => this.spinner = false);
  }



  setValueisForeignAid(res: any) {
    this.frmGroup.patchValue({
    isForeignAid: (res.isForeignAid.toString()),
  })
  }


  setValueFromObjectiveCost(res: any) {
    this.frmGroup.patchValue({
      isIncludedInAdpRadp: (res.isIncludedInAdpRadp.toString()),
      isFinancialEconomicAnalysis: (res.isFinancialEconomicAnalysis.toString()),
      isMinisterApprovedNewProject: (res.isMinisterApprovedNewProject.toString()),
      isProjectLandRequired: (res.isProjectLandRequired.toString()),
      isProjectFeasibilityStudyRequired: (res.isProjectFeasibilityStudyRequired.toString()),
      isProjectFeasibilityStudyDone: (res.isProjectFeasibilityStudyDone.toString()),
      isEnvironmentalClearance: (res.isEnvironmentalClearance.toString()),
      isLocatedInECA: (res.isLocatedInECA.toString()),
      isEIA: (res.isEIA.toString()),

      isPppNeeded: (res.isPppNeeded.toString()),
      isCompensationOrRehabilitationNeeded: (res.isCompensationOrRehabilitationNeeded.toString()),
      isManpowerApproved: (res.isManpowerApproved.toString()),
      environmentalImpactWiseProjectCategory: (res.environmentalImpactWiseProjectCategory.toString()),

      projectLandDescription: res.projectLandDescription,
      projectFeasibilityStudyRequiredDescription: res.projectFeasibilityStudyRequiredDescription,
      projectFeasibilityStudyDoneDescription: res.projectFeasibilityStudyDoneDescription,
      projectFeasibilityStudyAttachId: res.projectFeasibilityStudyAttachId,
      environmentalClearanceDescription: res.environmentalClearanceDescription,
      locatedInEcaDescription: res.locatedInEcaDescription,
      eiaDescription: res.eiaDescription,
      pppDescription: res.pppDescription,
      approvalDate: res.approvalDate,
      relevanceWithProgram: res.relevanceWithProgram,
      relevanceOfTheProposal: res.relevanceOfTheProposal,
      institutionalArrangement: res.institutionalArrangement,
      relevanceWithOtherDevelopmentProgrammes: res.relevanceWithOtherDevelopmentProgrammes,
      expectedSocioEconomicBenefits: res.expectedSocioEconomicBenefits,
      financialEconomicAnalysisDescription: res.financialEconomicAnalysisDescription,
      compensationOrRehabilitationDescription: res.compensationOrRehabilitationDescription,
      manpowerApprovedAttachId: res.manpowerApprovedAttachId,
      sustainabilityOfTheProjectBenefit: res.sustainabilityOfTheProjectBenefit,
    })
  }

  getProjectSummary() {
    this.spinner = true;
    this.projectSummaryService.getByUuid(this.pcUuid).subscribe(res => {
      this.paripatraVersion = res.paripatraVersion.nameEn;
      this.isForeignAid = res.isForeignAid;
      if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
        this.isParipatra2016 = true;
      } else {
        this.isParipatra2016 = false;
      }
      this.projectSummary = res;
      this.isParipatra2016 = res?.isParipatra2016;
      if ((this.nothiStatus === 'Draft')) {
        this.nothiStatus = res?.isForeignAid ? 'Draft' : 'খসড়া';
      }
      this._translateService.use(res.projectTypeDTO.nameEn.toUpperCase() == 'TAPP' ? 'en' : res.isForeignAid ? 'en' : 'bn');
      this.isEnLabel = this._translateService.currentLang === 'en';
      if (!this.isEnLabel) {
        this.layoutHelperService.setLanguageEvent('bn');
        this.layoutHelperService.changeNavLanguage('bn');
      }
      else {
        this.layoutHelperService.changeNavLanguage('en');
      }

      if (res.isForeignAid) {
        this._translateService.use('en');
      } else {
        this._translateService.use('bn');
      }

      this.titleEn = res.titleEn;
      this.titleBn = res.titleBn;
      this.conceptId = res.id;

      this.commencementDate = this.datePipe.transform(res.expCommencementDate, 'dd/MM/yyyy');
      this.completionDate = this.datePipe.transform(res.expCompletionDate, 'dd/MM/yyyy');
      this.id = res.id;
      this.getAgency();
      if (res.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
        this.isDppProjectType = true;
      }
      this.getSector(res);
      this.getSubSector(res);
      this.getSectorDivision(res);
      this.annexure5bData(res.id);
      this.getByLocationWiseCostProjectConceptMasterId();
      this.setValueisForeignAid(res)

      this.spinner = false;

    }, error => this.spinner = false);
  }



  annexure5bData(pcId) {
    this.annxGoodService.getAnnexure5bData(pcId).subscribe((res) => {
      if (res) {
        this.annexure5b = res;
      }
      if (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
        let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];
        this.projectCost.gobAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobAmount.toFixed(2));
        this.projectCost.dpa_Amount = this.numberPipe.convertToBanglaNumber((grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2));
        this.projectCost.gobFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobFeAmount.toFixed(2));
        this.projectCost.paAmount = this.numberPipe.convertToBanglaNumber((grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2));
        this.projectCost.paRpaAmount = this.numberPipe.convertToBanglaNumber(grandTotal.gobThruAmount + grandTotal.spAcAmount.toFixed(2));
        this.projectCost.ownFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundFeAmount.toFixed(2));
        this.projectCost.ownFundAmount = this.numberPipe.convertToBanglaNumber(grandTotal.ownFundAmount.toFixed(2));
        this.projectCost.othersAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherAmount.toFixed(2));
        this.projectCost.otherFeAmount = this.numberPipe.convertToBanglaNumber(grandTotal.otherFeAmount.toFixed(2));
        this.projectCost.totalAmount = this.numberPipe.convertToBanglaNumber(grandTotal.totalAmount.toFixed(2));
        let fiscalYear = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].grandTotal;

        if (fiscalYear.length > 0) {
          this.fiscalYearsList = [];
          for (let k = 0; k < fiscalYear.length; k++) {
            this.fiscalYearsList.push({
              fiscalYear: this.numberPipe.convertToBanglaNumber(fiscalYear[k].fiscalYear),
              govAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.gobAmount.toFixed(2)),
              govFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.gobFeAmount.toFixed(2)),
              rpaAmount: this.numberPipe.convertToBanglaNumber((fiscalYear[k].dppAnnualPhasingCostTotal.gobThruAmount + fiscalYear[k].dppAnnualPhasingCostTotal.spAcAmount).toFixed(2)),
              dpaAmount: this.numberPipe.convertToBanglaNumber((fiscalYear[k].dppAnnualPhasingCostTotal.thruPdAmount + fiscalYear[k].dppAnnualPhasingCostTotal.thruDpAmount).toFixed(2)),
              ownFundAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.ownFundAmount.toFixed(2)),
              ownFundFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.ownFundFeAmount.toFixed(2)),
              otherAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.otherAmount.toFixed(2)),
              otherFeAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.otherFeAmount.toFixed(2)),
              totalAmount: this.numberPipe.convertToBanglaNumber(fiscalYear[k].dppAnnualPhasingCostTotal.totalAmount.toFixed(2)),
            });
          }
        }
      } else {
        let grandTotal = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].dppAnnualPhasingCostTotal[0];
        this.projectCost.gobAmount = grandTotal.gobAmount.toFixed(2);
        this.projectCost.dpa_Amount = grandTotal.thruPdAmount + grandTotal.thruDpAmount.toFixed(2);
        this.projectCost.gobFeAmount = grandTotal.gobFeAmount.toFixed(2);
        this.projectCost.paAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount + grandTotal.thruPdAmount + grandTotal.thruDpAmount).toFixed(2);
        this.projectCost.paRpaAmount = (grandTotal.gobThruAmount + grandTotal.spAcAmount).toFixed(2);
        this.projectCost.ownFeAmount = grandTotal.ownFundFeAmount.toFixed(2);
        this.projectCost.ownFundAmount = grandTotal.ownFundAmount.toFixed(2);
        this.projectCost.othersAmount = grandTotal.otherAmount.toFixed(2);
        this.projectCost.otherFeAmount = grandTotal.otherFeAmount.toFixed(2);
        this.projectCost.totalAmount = grandTotal.totalAmount.toFixed(2);
        let fiscalYear = res.filter(f => f.dppAnnualPhasing === "Grand_Total")[0].grandTotal;

        if (fiscalYear.length > 0) {
          this.fiscalYearsList = [];
          for (let k = 0; k < fiscalYear.length; k++) {
            this.fiscalYearsList.push({
              fiscalYear: fiscalYear[k].fiscalYear,
              govAmount: fiscalYear[k].dppAnnualPhasingCostTotal.gobAmount.toFixed(2),
              govFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.gobFeAmount.toFixed(2),
              rpaAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.gobThruAmount + fiscalYear[k].dppAnnualPhasingCostTotal.spAcAmount).toFixed(2),
              dpaAmount: (fiscalYear[k].dppAnnualPhasingCostTotal.thruPdAmount + fiscalYear[k].dppAnnualPhasingCostTotal.thruDpAmount).toFixed(2),
              ownFundAmount: fiscalYear[k].dppAnnualPhasingCostTotal.ownFundAmount.toFixed(2),
              ownFundFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.ownFundFeAmount.toFixed(2),
              otherAmount: fiscalYear[k].dppAnnualPhasingCostTotal.otherAmount.toFixed(2),
              otherFeAmount: fiscalYear[k].dppAnnualPhasingCostTotal.otherFeAmount.toFixed(2),
              totalAmount: fiscalYear[k].dppAnnualPhasingCostTotal.totalAmount.toFixed(2),
            });
          }
        }
      }
    })
  }

  getObjectiveAndCostByProjectConceptId() {
    this.subscribe$.add(
      this.objectiveAndCostService.getByProjectConceptUuid(this.pcUuid).subscribe((response: any) => {
        this.modeFinancingList = response.res.modeFinanceList;
        this.objectivesTargets = response.res.objectivesTargets;
      })
    );
  }

  setModeFinanceListFromPcModeOfFinance(res: ModeOfFinanceModel[]) {
    this.modeNameList.forEach(e => {
      const modeType = this.modeFinanceTypeList.find(f => f.name === e.nameEn);
      this.modeFinancingList.push({
        modeId: modeType.id,
        modeSource: (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? e.nameBn : e.nameEn,
        modeSourceVal: '',
        gob: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        gobFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        pa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        paRpa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        ownFund: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        ownFundFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        others: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        othersFe: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        paSources: '',
        isEdited: modeType.isEdited
      });

      this.lockModeFinancingList.push({
        modeId: modeType.id,
        pa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        paRpa: res.filter(f => f.modeId === modeType.id).reduce(() => 0, 0),
        paSources: ''
      });
    });
  }

  calculateModeFinanceTotal() {
    let grandGob = 0;
    let grandGobFe = 0;
    let grandPa = 0;
    let grandPaRpa = 0;
    let grandOwnFund = 0;
    let grandOwnFundFe = 0;
    let grandOthers = 0;
    let grandOthersFe = 0;
    for (let i = 0; i < this.modeFinancingList.length; i++) {
      grandGob += this.modeFinancingList[i].gob;
      grandGobFe += this.modeFinancingList[i].gobFe;
      grandPa += this.modeFinancingList[i].pa;
      grandPaRpa += this.modeFinancingList[i].paRpa;
      grandOwnFund += this.modeFinancingList[i].ownFund;
      grandOwnFundFe += this.modeFinancingList[i].ownFundFe;
      grandOthers += this.modeFinancingList[i].others;
      grandOthersFe += this.modeFinancingList[i].othersFe;
    }
    if (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') {
      this.grandGob = this.numberPipe.convertToBanglaNumber(grandGob.toFixed(2));
      this.grandGobFe = this.numberPipe.convertToBanglaNumber(grandGobFe.toFixed(2));
      this.grandPa = this.numberPipe.convertToBanglaNumber(grandPa.toFixed(2));
      this.grandPaRpa = this.numberPipe.convertToBanglaNumber(grandPaRpa.toFixed(2));
      this.grandOwnFund = this.numberPipe.convertToBanglaNumber(grandOwnFund.toFixed(2));
      this.grandOwnFundFe = this.numberPipe.convertToBanglaNumber(grandOwnFundFe.toFixed(2));
      this.grandOthers = this.numberPipe.convertToBanglaNumber(grandOthers.toFixed(2));
      this.grandOthersFe = this.numberPipe.convertToBanglaNumber(grandOthersFe.toFixed(2));
    } else {
      this.grandGob = grandGob;
      this.grandGobFe = grandGobFe;
      this.grandPa = grandPa;
      this.grandPaRpa = grandPaRpa;
      this.grandOwnFund = grandOwnFund;
      this.grandOwnFundFe = grandOwnFundFe;
      this.grandOthers = grandOthers;
      this.grandOthersFe = grandOthersFe;
    }
  }

  setEmptyModeFinanceList() {
    this.modeNameList.forEach(e => {
      const modeType = this.modeFinanceTypeList.find(f => f.name === e.nameEn);
      this.modeFinancingList.push({
        modeId: modeType.id,
        modeSource: (this.projectSummary.isForeignAid == false && this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? e.nameBn : e.nameEn,
        modeSourceVal: '',
        gob: 0,
        gobFe: 0,
        pa: 0,
        paRpa: 0,
        ownFund: 0,
        ownFundFe: 0,
        others: 0,
        othersFe: 0,
        paSources: '',
        isEdited: modeType.isEdited
      });
      this.lockModeFinancingList.push({
        modeId: modeType.id,
        pa: 0,
        paRpa: 0,
        paSources: ''
      });
    });
  }

  getLogFrameByPcid() {
    this.spinner = true;
    this.subscribe$.add(
      this.logFrameService.getByProjectConceptUuid(this.conceptUuid).subscribe((response) => {
        let res = response.res;
        this.logFrame = response.res;
        if (res) {
          this.logFrame = res;
        } else {
        }
        this.spinner = false;
      })
    );
  }


  /**
    * get location wise cost by project concept master id
    * @private
    */
  getByLocationWiseCostProjectConceptMasterId() {
    this.subscribe$.add(
      this.service.getByProjectConceptMasterId(this.conceptId).subscribe(res => {
        this.locationWiseCost = res;
        this.getLocationByObjectCostId();
      })
    );
  }

  private getLocationByObjectCostId() {
    this.subscribe$.add(
      this.locationService.getLocationByObjectiveCostIdUsingProjectSummary(this.conceptId).subscribe(res => {
        if (res) {
          this.locations = res;
          this.arrangeData(res);
        } else {
          // this.saveDisable = true;
          this.show = true;
          this.snackbarHelper.openWarnSnackBarWithMessage("Require to save Part-A (Project Summary)", OK);
        }
      }, _ => {
        // this.saveDisable = true;
        this.show = true;
      })
    );
  }

  private arrangeData(res) {
    let di = 0;
    res.divisions.forEach(division => {
      let zi = 0;
      let upazilaUnderDivision = division.zillaList.reduce((sum, current) => sum + current.upaZillaList.length, 0);

      if (division && division.zillaList.length == 0) {
        this.createViewList(res.dppMasterId, division, null, null, di, zi, 0, upazilaUnderDivision);
      }

      division.zillaList.forEach(zilla => {
        let ui = 0;

        if (zilla && zilla.upaZillaList.length == 0) {
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

  createViewList(dppMasterId, division, zilla, upazila, di, zi, ui, upazilaUnderDivision) {
    const serial = ((!this.projectSummary?.isForeignAid && this.projectSummary?.projectTypeDTO.nameEn.toUpperCase() == 'DPP') ? this.numberPipe.convertToBanglaNumber(di + 1) : di + 1);
    let lwc: IDppLocationWiseCostBreakdown;
    if (upazila) {
      lwc = this.locationWiseCost.find(f => f.upazilaId === upazila.id);
    } else if (zilla) {
      lwc = this.locationWiseCost.find(f => f.zillaId === zilla.id);
    } else if (division) {
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
          projectConceptMasterId: this.conceptId,
          projectConceptMasterUuid: this.conceptUuid,
          comment: lwc ? lwc?.comment : '',
          estimatedCost: lwc ? lwc.estimatedCost : 0,
          quantity: lwc ? lwc?.quantity : '',
        },
        sl: serial,
        dSpan: this.calDSpan(division, zilla, upazila, zi, ui), //((zi === 0 && ui === 0) ? upazilaUnderDivision : 0),
        zSpan: this.calZSpan(zilla, ui), //((ui === 0) ? (division.zillaList[zi].upaZillaList.length) : 0),
        upazila: upazila,
        division: division,
        zilla: zilla,

      }
    );
  }

  calDSpan(division, zilla, upazila, zi, ui) {
    let dRowSpan = 0;
    if (zi == 0 && ui == 0) {
      if (zilla) {
        division?.zillaList.forEach(element => {
          dRowSpan += element.upaZillaList.length == 0 ? 1 : element.upaZillaList.length;
        })
      } else {
        dRowSpan = 1
      }
    } else if (zi == 0 && !ui) {
      dRowSpan = division?.zillaList.length;
    } else {
      dRowSpan = 0;
    }
    return dRowSpan;
  }

  calZSpan(zilla, ui) {
    let zRowSpan;
    if (ui === 0) {
      if (zilla == null) {
        zRowSpan = 1;
      } else if (zilla?.upaZillaList.length == 0) {
        zRowSpan = 1;
      } else {
        zRowSpan = zilla?.upaZillaList.length;
      }
    } else {
      zRowSpan = 0;
    }
    return zRowSpan;
  }



  private getSectorDivision(concept: IProjectConcept) {
    this.sectorDivisionService.getById(concept.sectorDivisionId).subscribe(res => {
      this.sectorDivision = res;
    })
  }

  private getSector(concept: IProjectConcept) {
    this.sectorService.getById(concept.sectorId).subscribe(res => {
      this.sector = res;
    })
  }

  private getSubSector(concept: IProjectConcept) {
    this.subSectorService.getById(concept.subSectorId).subscribe(res => {
      this.subSector = res;
    })
  }

  getProjectSummaryId(url, forUrl = "") {
    let routeUrl = '';
    if (forUrl == "") {
      routeUrl = "dpp-tapp/" + url + "/" + this.pcUuid;
    } else {
      routeUrl = url;
    }
    this.route.navigate([routeUrl]);
  }
  navigateToList() {
    this.route.navigate([`dpp-tapp`]);
  }

  private getAgency() {
    this.agencyService.getById(this.projectSummary.agencyId).subscribe(res => {
      this.agencyModel = res;
      this.totalAllocationByAgency = res.ceilingAmount ? res.ceilingAmount : 0;
    })
  }


    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
        });
    }

  getAll() {
    this.subscribe$.add(
      this.projectSummaryService.getByUuid(this.conceptUuid).subscribe(res => {
        this.paripatraVersion = res.paripatraVersion.nameEn;
        if (res.paripatraVersion.nameEn == 'Paripatra 2016') {
          this.isParipatra2016 = true;
        } else {
          this.isParipatra2016 = false;
        }
        if (res) {
          this.projectSummary = res;
          this.isForeignAid = res.isForeignAid;
        }
      })
    );

    this.subscribe$.add(
      this.annualPhasingCostService.getDetailsEstimatedCost(this.conceptUuid).subscribe(res => {
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
        this.show = false;
      })
    );
  }

  uploadImageAsBase64(files: any, propertyName: string) {
    this.utilsService.uploadImageAsBase64(this.frmGroup, files, propertyName);
  }


  // set Completion Min Date
  commencementDataChange($event: MatDatepickerInputEvent<Date>) {
    const value = new Date($event.value);
    this.expCompletionMinDate = new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

    getOtherDetails() {
        this.otherDetailsService.getOtherDetails(this.conceptUuid).subscribe((res) => {
            this.specificationLinkagePerspective = res.specificationLinkagePerspective;
        })
    }

  goBackToHome() {
    window.history.back();
  }


  downloadMafReport($fileName = '' ) {
    this.data['fileName'] = $fileName;
    this.data['templateName'] = 'pps-reports/dpp/mafReport';
    this.data['lng'] = (this.projectSummary.projectTypeDTO.nameEn.toUpperCase() == 'DPP' && this.projectSummary.isForeignAid == false) ? 'bn' : 'en';


    this.data['getAllDataMAF'] = JSON.stringify(this.getAllDataMAF);
    this.data['upazilas'] = JSON.stringify(this.upazilas);
    this.data['revenueList'] = JSON.stringify(this.revenueList);
    this.data['revenueTotal'] = JSON.stringify(this.revenueTotal);
    this.data['capitalList'] = JSON.stringify(this.capitalList);
    this.data['capitalTotal'] = JSON.stringify(this.capitalTotal);
    this.data['physicalContingencyTotal'] = JSON.stringify(this.physicalContingencyTotal);
    this.data['priceContingencyTotal'] = JSON.stringify(this.priceContingencyTotal);
    this.data['grantTotal'] = JSON.stringify(this.grantTotal);
    this.data['projectSummary'] = JSON.stringify(this.projectSummary);
    this.data['agency'] = JSON.stringify(this.agencyModel);


    this.data['logFrame'] = JSON.stringify(this.logFrame);
    this.data['sectorDivision'] = JSON.stringify(this.sectorDivision);
    this.data['sector'] = JSON.stringify(this.sector);
    this.data['subSector'] = JSON.stringify(this.subSector);
    this.data['objectivesTargets'] = JSON.stringify(this.objectivesTargets);
    this.data['modeFinancingList'] = JSON.stringify(this.modeFinancingList);
    this.data['fiscalYearsList'] = JSON.stringify(this.fiscalYearsList);
    this.data['specificationLinkagePerspective'] = JSON.stringify(this.specificationLinkagePerspective);


    this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
    this.data['dpa_Amount'] = JSON.stringify(this.projectCost.dpa_Amount);
    this.data['gobFeAmount'] = JSON.stringify(this.projectCost.gobFeAmount);
    this.data['paAmount'] = JSON.stringify(this.projectCost.paAmount);
    this.data['paRpaAmount'] = JSON.stringify(this.projectCost.paRpaAmount);
    this.data['ownFeAmount'] = JSON.stringify(this.projectCost.ownFeAmount);
    this.data['ownFundAmount'] = JSON.stringify(this.projectCost.ownFundAmount);
    this.data['othersAmount'] = JSON.stringify(this.projectCost.othersAmount);
    this.data['otherFeAmount'] = JSON.stringify(this.projectCost.otherFeAmount);
    this.data['totalAmount'] = JSON.stringify(this.projectCost.totalAmount);
    this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);
    this.data['gobAmount'] = JSON.stringify(this.projectCost.gobAmount);


    //Optional
    this.data['view'] = 0; // 0 = false or 1 = true
    this.data['print_r'] = 0; // 0 = false or 1 = true
    let actionUrl = `${reportBackend}/pdf-generate-post`;
    bl2Js(this.data, actionUrl);
  }





}

