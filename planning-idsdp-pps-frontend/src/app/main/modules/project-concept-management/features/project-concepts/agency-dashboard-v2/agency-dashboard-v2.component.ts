import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexXAxis,
    ApexPlotOptions, ApexNonAxisChartSeries, ApexResponsive, ApexLegend
} from "ng-apexcharts";
import {AgencyDashboardService} from "../../../services/agency-dashboard.service";
import {EcnecMeetingService} from "../../../../dpp-tapp-management/services/ecnec-meeting.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {DatePipe} from "@angular/common";
import {ProjectMovementService} from "../../../../dpp-tapp-management/services/project-movement.service";
import {AssingEcnecMeetingService} from "../../../../dpp-tapp-management/services/assign-ecnec-meeting.service";
import {ProjectSummaryService} from "../../../services/project-summary.service";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {DppObjectiveCostService} from "../../../../dpp-tapp-management/services/dpp-objective-cost.service";
import {TappObjectiveCostService} from "../../../../dpp-tapp-management/services/tapp-objective-cost.service";
import {SectorDivisionService} from "../../../../configuration-management/services/sector-division.service";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {MatDialog} from "@angular/material/dialog";
import {LayoutHelperService} from "../../../../../../layout/layouts/vertical/services/layout-helper.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {locale as lngEnglish} from "../agency-dashboard/i18n/en";
import {locale as lngBangla} from "../agency-dashboard/i18n/bn";
import {environment} from "../../../../../../../environments/environment";
import {FormControl, FormGroup} from "@angular/forms";
import {map, switchMap} from "rxjs/operators";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {IProjectConcept} from "../../../models/project-concept";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {DppObjectiveCostModel} from "../../../../dpp-tapp-management/models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../../dpp-tapp-management/models/tappObjectiveCost.model";
import {AgencyDashboardModel} from "../../../models/agency-dashboard.model";
import {EcnecMeetingModel} from "../../../../dpp-tapp-management/models/ecnec-meeting.model";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {SectorDivisionModel} from "../../../../configuration-management/models/sector-division.model";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {
    FeasibilityStudySummaryService
} from "../../../../feasibility-study-management/services/feasibility-study-summary.service";
import moment from "moment";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    colors: string[];
    pieSeries: ApexNonAxisChartSeries;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
};

@Component({
  selector: 'app-agency-dashboard-v2',
  templateUrl: './agency-dashboard-v2.component.html',
  styleUrls: ['./agency-dashboard-v2.component.scss']
})
export class AgencyDashboardV2Component extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild("barChartApprovedProject") barChartApproved: ChartComponent;
    public approvedBarChartOptions: Partial<ChartOptions>;
    @ViewChild("pieChartFeasibility") pieChartFS: ChartComponent;
    public unapprovedBarChartOptions: Partial<ChartOptions>;
    @ViewChild("barChartUnapprovedProject") barChartUnapproved: ChartComponent;
    public fsPieChartOptions: Partial<ChartOptions>;
    @ViewChild("pieChartRecommended") pieChartRec: ChartComponent;
    public recommendedPieChartOptions: Partial<ChartOptions>;

    spinner: boolean = false;

    navigationPage = environment.ibcs.navigateToUui;

    agencyDashboardModel: AgencyDashboardModel = new AgencyDashboardModel();
    inEcnec: boolean = false;
    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    plancom: boolean;
    agency: boolean;

    displayedColumnsPCList: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    dataSource: MatTableDataSource<EcnecMeetingModel>;
    sectorDivisionList: Array<SectorDivisionModel>;
    sectorList: Array<SectorModel>;
    dppObjectiveAndCostList: DppObjectiveCostModel[] = [];
    tappObjectiveAndCostList: TappObjectiveCostModel[] = [];
    actionPermission = [];
    commonDatasource: MatTableDataSource<IProjectConcept>;
    total: number;
    disableDelete: boolean;
    size: number = MAX_PAGE_SIZE;
    listPageSize : number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    sectorDivisionName: string;
    sectorDivision: any = {};
    private form: any;
    private formFs: any;
    projectList: any = [];
    plancomListPage: boolean = false;
    plancomDashbord: boolean = true;
    commonTotalElement: number;
    // @ViewChild("ongoingChart") chartOngoing: ChartComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    sectorDivisionTotalProject: any;
    sectorDivisionProjects: any= [];
    totalProjectsInEcnec: any;
    totalProjectsInAgency: any;
    totalProjectsInAgencyInPeparation: any;
    totalProjectsInAgencyRecust: any;
    projectsInEcnec: any;
    projectsInAgencyInpeparations: any;
    projectsInAgencyRecust: any;
    projectsInAgency: any;
    totalProjectsInPlancomm: any;
    projectsInPlancomm: any;
    totalApproved: any;
    totalUnapproved: any;
    approvedProjects: any;
    unApprovedProjects: any;
    totalProjectsInMinistry: any;
    projectsInMinistry: any

    recastProject: any;
    agency_name: string;
    loadAmount: boolean = false;
    projectsInMinistryInpeparations: any;
    projectsInMinistryRecust: any;
    totalProjectsInMinistryRecust: any;
    totalProjectsInMinistryInPeparation: any;
    projectsOngoing: any;
    projectsCompleted: any;
    totalProjectsOngoing: any;
    totalProjectsCompleted: any;
    totalProjects: any;
    dppProjectList: any[] = [];
    tappProjectList: any[] = [];
    rdppProjectList: any[] = [];
    rtappProjectList: any[] = [];
    dppProjectListStore: any[] = [];
    tappProjectListStore: any[] = [];
    rdppProjectListStore: any[] = [];
    rtappProjectListStore: any[] = [];
    dppUnapprovedProjectList: any[] = [];
    tappUnapprovedProjectList: any[] = [];
    rdppUnapprovedProjectList: any[] = [];
    rtappUnapprovedProjectList: any[] = [];
    dppUnapprovedProjectListStore: any[] = [];
    tappUnapprovedProjectListStore: any[] = [];
    rdppUnapprovedProjectListStore: any[] = [];
    rtappUnapprovedProjectListStore: any[] = [];
    fsProjectList: any[] = [];
    fsCompleteProjectList: any[] = [];
    fsNotCompleteProjectList: any[] = [];
    fsSummaryList: any[] =[];
    fsSummaryCompleteList: any[] =[];
    fsSummaryNotCompleteList: any[] =[];
    totalRecommended: number = 0;
    totalFs: number = 0;
    appFromDate: string;
    appToDate: string;
    unAppFromDate: string;
    unAppToDate: string;
    _changeInterval = null;
    searchText = "";

  constructor(
      private agencyDashboardService: AgencyDashboardService,
      private ecnecMeetingService: EcnecMeetingService,
      public numberPipe : NumberPipe,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private datePipe: DatePipe,
      private projectMovementService: ProjectMovementService,
      private assignMeetingService : AssingEcnecMeetingService,
      private projectSummaryService: ProjectSummaryService,
      private sectorService: SectorService,
      private dppObjectiveCostService: DppObjectiveCostService,
      private tappObjectiveCostService: TappObjectiveCostService,
      private sectorDivisionService: SectorDivisionService,
      private fileUploadService: FileUploadService,
      private snackbarHelper : SnackbarHelper,
      private userGroupService: UserGroupService,
      private dialog: MatDialog,
      private layoutHelperService: LayoutHelperService,
      private sanitizer : DomSanitizer,
      private router: Router,
      private feasibilityStudySummaryService: FeasibilityStudySummaryService,
  ) {
      super();
      this.getGisMapUrl();
      this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
      let url_string = window.location.href;
      let url = new URL(url_string);
      let storeSessionId = url.searchParams.get("p");

      if(storeSessionId) {
          this.router.navigateByUrl('/dashboard');
      }

      this.populateForm();
      this.loadData();
      this.getUserGroup();
      this.getAllApi();
  }

    getGisMapUrl() {
        return  this.sanitizer.bypassSecurityTrustResourceUrl(environment.ibcs.gisUrl+'gisDashboard?access_token='+sessionStorage.getItem('access_token'));
    }

    clearSearchForm() {
        this.form.reset();
        this.populateForm();
    }

    private populateForm(): void {
        this.form = new FormGroup({
            projectType: new FormControl(''),
            sectorDivision: new FormControl(''),
            fundingType: new FormControl(''),
            projectName: new FormControl(''),
            sector: new FormControl(''),
            lowAmount: new FormControl(''),
            highAmount: new FormControl(''),
            status: new FormControl(''),
        });
    }

    getFsSummaryList(callBack) {
      this.feasibilityStudySummaryService.getFsSummaryList().subscribe(res => {
          this.fsSummaryList = res;
          callBack(true);
      })
    }

    checkFsSummaryList () {
        if (this.fsSummaryList.length !== 0) {
            this.fsSummaryCompleteList = this.fsSummaryList.filter(e => e.dppMasterId !== null);
            this.fsSummaryNotCompleteList = this.fsSummaryList.filter(e => e.dppMasterId === null);
        }
    }

    private getAllApi() {
        this.spinner = false;
        this.subscribe$.add(
            this.sectorService.getActiveSector().pipe(
                switchMap(sector => this.sectorDivisionService.getActiveSectorDivision().pipe(
                    switchMap(sectorDivision => this.dppObjectiveCostService.getObjectiveCostList().pipe(
                        switchMap(dppObjectiveCost => this.tappObjectiveCostService.getTappObjectiveCostList().pipe(
                            switchMap(tappObjectiveCost => this.ecnecMeetingService.getActiveEcnecMeetingList().pipe(
                                map(ecnecMeeting => ({
                                    sector: sector,
                                    sectorDivision: sectorDivision,
                                    dppObjectiveCost: dppObjectiveCost,
                                    tappObjectiveCost: tappObjectiveCost,
                                    ecnecMeetingList:ecnecMeeting
                                }))
                            ))
                        ))
                    ))
                ))
            ).subscribe(res => {
                this.sectorList = res.sector;
                this.sectorDivisionList = res.sectorDivision;
                this.dppObjectiveAndCostList = res.dppObjectiveCost;
                this.tappObjectiveAndCostList = res.tappObjectiveCost;
                this.searchByCriteria();
            }, error => this.spinner = false)
        )
    }


    searchByCriteria() {
        const projectType = this.form.value.projectType === '' ? null : this.form.value.projectType;
        const sectorDivision = this.form.value.sectorDivision === '' ? null : this.form.value.sectorDivision;
        const gob = this.form.value.fundingType === 'GoB';
        const isForeignAi = this.form.value.fundingType === 'PA';
        const isFsRequired = false;
        const projectName = this.form.value.projectName === '' ? null : this.form.value.projectName;
        const sector = this.form.value.sector === '' ? null : this.form.value.sector;
        const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
        const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
        const status = this.form.value.status === '' ? null : this.form.value.status;
        this.loadAmount = true;
        this.subscribe$.add(

            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.DPP, this.page, this.size).subscribe(
                res => {
                    this.projectList = this.arrangeData(res.content);
                    this.findProjectBySector();
                    this.total = res.totalElements;
                    this.loadAmount = false;
                },
                error => {
                    this.loadAmount = false;
                    this.spinner = false;
                    console.log('error ', error);
                }
            )
        );
    }

    findProjectBySector(){
        this.sectorDivisionProjects  = this.projectList.filter(f => f.sectorDivisionId == this.sectorDivision.id);
        this.sectorDivisionTotalProject = this.sectorDivisionProjects.length;
        this.findInEcnecTotal();
        this.findInMinistryTotal();
        this.findApprovedTotal();
        this.findPlancommTotal();
        this.findTotalAgencyInperarationProject();
        this.findTotalAgencyProjects();
        this.findTotalMinistryInperarationProject();

        // this.findTotalAgencyRecustProject();
        this.findProjectsOngoingTotal();
        this.findProjectsCompletedTotal();
    }

    // Total Agency Projects
    findTotalAgencyProjects(){
        this.projectsInAgency = this.projectList;
        this.totalProjectsInAgency = this.projectsInAgency.length;
    }

    // Total Inpeparations Projects
    findTotalAgencyInperarationProject(){
        this.projectsInAgencyInpeparations = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.ATTACH_POTRO_JARI ||
            sdp.status == ProjectMovementStageConstant.AGENCY_DESK);
        this.totalProjectsInAgencyInPeparation = this.projectsInAgencyInpeparations.length;
        this.findTotaAgencyHead();
        this.findTotalAgencyRecustProject();

    }



    // Total projectsInAgencyRecust Projects
    findTotalAgencyRecustProject(){
        let indexList=[];
        console.log( this.projectsInAgencyInpeparations);
        this.projectsInAgencyInpeparations.forEach((e,index) =>{
            if(e.projectTypeDTO.nameEn.toUpperCase() === 'DPP'){
                this.dppObjectiveCostService.getByProjectConceptUuid(e.uuid).subscribe(res =>{
                    this.projectMovementService.getAllStageByMasterId(e.projectTypeDTO.nameEn, res.res.id).subscribe(res2 =>{
                        if(res2.filter((r)=>{
                            return r.currentStage=='MINISTRY_HEAD'
                        }).length>0){
                            this.totalProjectsInAgencyRecust+=1;
                            this.totalProjectsInAgencyInPeparation-=1;
                            this.projectsInAgencyRecust.push(e);
                            indexList.push(index);
                            this.projectsInAgencyInpeparations.splice(index,1);
                        }
                    })
                })
            }else{
                this.tappObjectiveCostService.getProjectConceptByUuid(e.uuid).subscribe(res =>{
                    this.projectMovementService.getAllStageByMasterId(e.projectTypeDTO.nameEn, res.res.id).subscribe(res2 =>{
                        if(res2.filter(r=>{
                            return r.currentStage=='MINISTRY_HEAD'
                        }).length>0){
                            this.totalProjectsInAgencyRecust+=1;
                            this.totalProjectsInAgencyInPeparation-=1;
                            this.projectsInAgencyRecust.push(e);
                            this.projectsInAgencyInpeparations.splice(index,1);
                        }
                    })
                })
            }
        })



    }

    findTotaAgencyHead(){
        this.projectsInAgencyRecust = this.projectList.filter(sdp=> sdp.status==ProjectMovementStageConstant.AGENCY_HEAD);
        this.totalProjectsInAgencyRecust = this.projectsInAgencyRecust.length;
    }

    findTotalMinistryInperarationProject(){
        this.projectsInMinistryInpeparations = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.MINISTRY_DESK ||
            sdp.status==ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY ||
            sdp.status==ProjectMovementStageConstant.MINISTERIAL_MEETING_NOTICE ||
            sdp.status==ProjectMovementStageConstant.MINISTERIAL_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DPEC_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DPEC_MEETING_NOTICE ||
            sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE ||
            sdp.status == ProjectMovementStageConstant.MINISTRY_REJECTED ||
            sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE);
        this.totalProjectsInMinistryInPeparation = this.projectsInMinistryInpeparations.length;
        this.findTotaMinistryHead();
        this.findTotalMinistryRecustProject();

    }

    findTotalMinistryRecustProject(){
        let indexList=[];
        console.log( this.projectsInMinistryInpeparations);
        this.projectsInMinistryInpeparations.forEach((e,index) =>{
            if(e.projectTypeDTO.nameEn.toUpperCase() === 'DPP'){
                this.dppObjectiveCostService.getByProjectConceptUuid(e.uuid).subscribe(res =>{
                    this.projectMovementService.getAllStageByMasterId(e.projectTypeDTO.nameEn, res.res.id).subscribe(res2 =>{
                        if(res2.filter((r)=>{
                            return r.currentStage=='PLANNING_COMMISSION_HEAD'
                        }).length>0){
                            this.totalProjectsInMinistryRecust+=1;
                            this.totalProjectsInMinistryInPeparation-=1;
                            this.projectsInMinistryRecust.push(e);
                            indexList.push(index);
                            this.projectsInMinistryInpeparations.splice(index,1);
                        }
                    })
                })
            }else{
                this.tappObjectiveCostService.getProjectConceptByUuid(e.uuid).subscribe(res =>{
                    this.projectMovementService.getAllStageByMasterId(e.projectTypeDTO.nameEn, res.res.id).subscribe(res2 =>{
                        if(res2.filter(r=>{
                            return r.currentStage=='PLANNING_COMMISSION_HEAD'
                        }).length>0){
                            this.totalProjectsInMinistryRecust+=1;
                            this.totalProjectsInMinistryInPeparation-=1;
                            this.projectsInMinistryRecust.push(e);
                            this.projectsInMinistryInpeparations.splice(index,1);
                        }
                    })
                })
            }
        })



    }

    findTotaMinistryHead(){
        this.projectsInMinistryRecust = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.MINISTRY_HEAD);
        this.totalProjectsInMinistryRecust = this.projectsInMinistryRecust.length;
    }


    // Total Acnec Projects
    findInEcnecTotal(){
        this.projectsInEcnec = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.IN_ECNEC ||
            sdp.status==ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE ||
            sdp.status==ProjectMovementStageConstant.ECNEC_DESK ||
            sdp.status == ProjectMovementStageConstant.ECNEC_OFFICERS ||
            sdp.status == ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC);
        this.totalProjectsInEcnec = this.projectsInEcnec.length;
    }

    // Total Ministry Projects
    findInMinistryTotal(){
        this.projectsInMinistry = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.MINISTRY_DESK ||
            sdp.status== ProjectMovementStageConstant.MINISTRY_HEAD ||
            sdp.status==ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY ||
            sdp.status==ProjectMovementStageConstant.MINISTERIAL_MEETING_NOTICE ||
            sdp.status==ProjectMovementStageConstant.MINISTERIAL_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DPEC_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DPEC_MEETING_NOTICE ||
            sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE ||
            sdp.status == ProjectMovementStageConstant.MINISTRY_REJECTED ||
            sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD ||
            sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE);
        this.totalProjectsInMinistry = this.projectsInMinistry.length;
    }

    // Total Approve Projects
    findApprovedTotal(){
        console.log(this.projectList.length)
        this.approvedProjects = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.ECNEC_APPROVED ||
            sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED);
        this.totalApproved = this.approvedProjects.length;

        this.unApprovedProjects = this.projectList.filter(sdp=>
            sdp.status !=ProjectMovementStageConstant.ECNEC_APPROVED &&
            sdp.status != ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED);
        this.totalUnapproved = this.unApprovedProjects.length;

        this.checkApprovedProjectType(this.approvedProjects);
        this.checkUnapprovedProjectType(this.unApprovedProjects);
    }

    checkApprovedProjectType(approvedProjects) {
      approvedProjects.forEach(f => {
          if (f.projectTypeDTO.nameEn == 'DPP') {
              this.dppProjectListStore.push(f);
          } else if (f.projectTypeDTO.nameEn == 'TAPP') {
              this.tappProjectListStore.push(f)
          }
      })
        this.dppProjectList = [...this.dppProjectListStore]
        this.tappProjectList = [...this.tappProjectListStore]
        this.barChartApprovedProject();
        console.log("call first")
        console.log(this.dppProjectList.length)
        console.log(this.tappProjectList.length)
    }

    checkUnapprovedProjectType(unapprovedProjects) {
        unapprovedProjects.forEach(f => {
          if (f.projectTypeDTO.nameEn == 'DPP') {
              this.dppUnapprovedProjectListStore.push(f);
          } else if (f.projectTypeDTO.nameEn == 'TAPP') {
              this.tappUnapprovedProjectListStore.push(f)
          }
      })
        this.dppUnapprovedProjectList = this.dppUnapprovedProjectListStore;
        this.tappUnapprovedProjectList = this.tappUnapprovedProjectListStore;
        this.barChartUnapprovedProject();
        console.log(this.dppUnapprovedProjectList.length)
        console.log(this.tappUnapprovedProjectList.length)
    }

    // Total Plancom Projects
    findPlancommTotal(){
        this.projectsInPlancomm = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.PLANNING_COMMISSION_DESK ||
            sdp.status == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD ||
            sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER ||
            sdp.status == ProjectMovementStageConstant.PEC_MEETING_NOTICE ||
            sdp.status == ProjectMovementStageConstant.PEC_MEETING_HELD ||
            sdp.status ==  ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM);
        this.totalProjectsInPlancomm = this.projectsInPlancomm.length;
    }

    findProjectsOngoingTotal(){
        this.projectsOngoing = this.projectList.filter(sdp=>
            (sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED ||
                sdp.status == ProjectMovementStageConstant.ECNEC_APPROVED ||
                sdp.status == ProjectMovementStageConstant.MINISTRY_APPROVED) && !this.isDateOver(sdp.completionDate));
        this.totalProjectsOngoing = this.projectsOngoing.length;
    }

    findProjectsCompletedTotal(){
        this.projectsCompleted = this.projectList.filter(sdp=>
            (sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED ||
                sdp.status == ProjectMovementStageConstant.ECNEC_APPROVED ||
                sdp.status == ProjectMovementStageConstant.MINISTRY_APPROVED) && this.isDateOver(sdp.completionDate));
        this.totalProjectsCompleted = this.projectsCompleted.length;
        this.totalProjects = this.totalProjectsOngoing + this.totalProjectsCompleted;
    }

    private isDateOver(dateStr) {
        const [day, month, year] = dateStr.split('-');
        const date = new Date(+year, +month - 1, +day);
        return new Date() > date;
    }

    viewForwardProjects(status){
        if(status == 'ECNEC'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInEcnec));
        }
        if(status == 'AGENCY'){
            let total: any[] = [...this.projectsOngoing, ...this.projectsOngoing];

            this.commonDatasource = new MatTableDataSource(this.arrangeData(total));
        }
        if(status == 'MINISTRY'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInMinistry));
        }
        if(status == 'APPROVED'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.approvedProjects));
        }
        if(status == 'PLANCOM'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInPlancomm));
        }
        if(status == 'RECAST'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInAgencyRecust));
        }
        if(status == 'INPROGRESS'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInAgencyInpeparations));
        }
        if(status == 'MINISTRY_RECAST'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInMinistryRecust));
        }
        if(status == 'MINISTRY_INPROGRESS'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInMinistryInpeparations));
        }
        if(status == 'ONGOING'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsOngoing));
        }
        if(status == 'COMPLETED'){
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsCompleted));
        }

        this.commonTotalElement =this.commonDatasource?.filteredData?.length;
        this.plancomDashbord = false;
        this.plancomListPage = true;
    }

    private arrangeData(res: IProjectConcept[]) {
        return res?.map(m => ({
            ...m,
            movementStatus: m?.status ? m?.status== 'ECNEC_OFFICERS' ? "ECNEC WINGS": m?.status?.split('_').join(' ') : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList?.filter(e => e.id === m.sectorDivisionId).map(m => m.sectorDivisionNameEn),
            titleEn: (m.projectTypeDTO?.nameEn.toLowerCase() === 'dpp') ? this.getTitleEn(m, this.dppObjectiveAndCostList) : this.getTitleEn(m, this.tappObjectiveAndCostList),
            titleBn: (m.projectTypeDTO?.nameEn.toLowerCase() === 'dpp') ? this.getTitleBn(m, this.dppObjectiveAndCostList) : this.getTitleBn(m, this.tappObjectiveAndCostList),
            commencementDate: (m.projectTypeDTO?.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCommencementDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCommencementDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy'),
            completionDate: (m.projectTypeDTO?.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCompletionDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCompletionDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy')
        }));
    }

    private getTitleEn(m, objectiveCostList) {
        const value = objectiveCostList.filter(e => e.projectConceptMasterId === m.id).map(m1 => m1.projectTitleEn)[0];
        return value ? value : m.titleEn;
    }

    private getTitleBn(m, objectiveCostList) {
        const value = objectiveCostList.filter(e => e.projectConceptMasterId === m.id).map(m1 => m1.projectTitleBn)[0];
        return value ? value : m.titleBn;
    }

    private getCommencementDate(m, objectiveCostList) {
        const value = objectiveCostList.filter(e => e.projectConceptMasterId === m.id).map(m1 => m1.dateCommencement)[0];
        return value ? value : m.expCommencementDate;
    }

    private getCompletionDate(m, objectiveCostList) {
        const value = objectiveCostList.filter(e => e.projectConceptMasterId === m.id).map(m1 => m1.dateCompletion)[0];
        return value ? value : m.expCompletionDate;
    }

    private loadData() {
        this.spinner = true;
        this.subscribe$.add(
            this.agencyDashboardService.getAgencyDashboardData().subscribe(res => {
                this.agencyDashboardModel = res;
                this.totalRecommended = res.pecMeetingHeld+res.pscMeetingHeld+res.dppAtPC+res.dppPrepared+res.dppNotPrepared;
                this.totalFs = this.agencyDashboardModel.totalFs;
                //

                this.rdppProjectListStore = this.agencyDashboardModel.rdppApprovedProjectList;
                this.rtappProjectListStore = this.agencyDashboardModel.rtappApprovedProjectList;
                this.rdppUnapprovedProjectListStore = this.agencyDashboardModel.rdppNotApprovedProjectList;
                this.rtappUnapprovedProjectListStore = this.agencyDashboardModel.rtappNotApprovedProjectList;

                this.rdppProjectList = [...this.rdppProjectListStore]
                this.rtappProjectList = [...this.rtappProjectListStore]
                this.rdppUnapprovedProjectList = [...this.rdppUnapprovedProjectListStore]
                this.rtappUnapprovedProjectList = [...this.rtappUnapprovedProjectListStore]


                this.barChartApprovedProject();
                this.barChartUnapprovedProject();
                this.pieChartRecommended();
                this.pieChartFeasibility()
                console.log("call second")
                console.log(this.dppProjectList.length)
                console.log(this.tappProjectList.length)
                console.log(this.dppUnapprovedProjectList.length)
                console.log(this.tappUnapprovedProjectList.length)
                this.spinner = false;
            })
        );
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            console.log(res.res);
            this.userGroup = res.res;
            if(this.userGroup.groupStatus == 'ECNEC-OFFICER' || this.userGroup.groupStatus == 'ECNEC-DESK' || this.userGroup.groupStatus == 'ECNEC-HEAD') {
                this.inEcnec = true;
                this.layoutHelperService.changeNavLanguage('bn');
            } else if (this.userGroup.groupStatus == 'PLANNING-DESK' || this.userGroup.groupStatus == 'PLANNING-HEAD') {
                this.plancom = true;
                this.layoutHelperService.changeNavLanguage('bn');
            } else {
                this.agency = true;
                this.layoutHelperService.changeNavLanguage('en');
            }
            if(this.userGroup.groupStatus == 'MINISTRY-DESK' || this.userGroup.groupStatus == 'MINISTRY-HEAD'){
                this.getMinistryUserInfo(this.userGroup.userId)
            } else {
                this.getUserInfoByUserId(this.userGroup.userId);
            }
            if (this.userGroup.groupStatus == 'PLANNING-MINISTER') {
                this.agency_name = 'Awaiting projects for Planning Minister';
            }
        });

    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = res.agency.nameEn;
        })
    }
    getMinistryUserInfo(userId){
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = res.ministryDivision.nameEn;

        })
    }

    backToDashbord() {
        this.plancomDashbord = true;
        this.plancomListPage = false;
    }

    gotToViewDashboard(uuid: any) {
        this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.searchByCriteria();
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    navigateToMap() {
        this.router.navigate([`gis-map-dashboard`]);
    }

  pieChartFeasibility() {
      this.fsPieChartOptions = {
          pieSeries: [this.agencyDashboardModel?.fsComplete, this.agencyDashboardModel?.fsNotComplete],
          chart: {
              width: 340,
              type: "pie",
              events: {
                  dataPointSelection: (event: any, chartContext: any, config: any) => {
                      this.chartAction( 'pieChartFeasibility', config.dataPointIndex);
                  },
                  dataPointMouseEnter: function(event) {
                      event.target.style.cursor = "pointer";
                      // event.path[0].style.cursor = "pointer";
                      // event.fromElement.style.cursor = "pointer";
                  }
              },
          },
          labels: ["Completed", "Not Completed"],
          colors: ["#78B697", "#bcead0"],
          legend: {
              show: true,
              position: "bottom",
              fontSize: '12px'
          },
          responsive: [
              {
                  breakpoint: 480,
                  options: {
                      chart: {
                          width: 200
                      },
                      legend: {
                          position: "bottom"
                      }
                  }
              }
          ]
      };
  }

    pieChartRecommended() {
        console.log(this.agencyDashboardModel.dppNotPrepared)
        this.recommendedPieChartOptions = {
            pieSeries: [
                this.agencyDashboardModel.pecMeetingHeld,
                this.agencyDashboardModel.dppNotPrepared,
                this.agencyDashboardModel.dppPrepared,
                this.agencyDashboardModel.pscMeetingHeld,
                this.agencyDashboardModel.dppAtPC
            ],
            chart: {
                width: 520,
                height: 460,
                type: "pie",
                events: {
                    dataPointSelection: (event: any, chartContext: any, config: any) => {
                        this.chartAction( 'pieChartRecommended', config.dataPointIndex);
                    },
                    dataPointMouseEnter: function(event) {
                        event.target.style.cursor = "pointer";
                        // event.path[0].style.cursor = "pointer";
                        // event.fromElement.style.cursor = "pointer";
                    }
                },
            },
            labels: [
                "PEC Meeting Held",
                "DPP not Prepared",
                "DPP Prepared",
                "Project Security Committee Meeting Held",
                "DPP Received at Planning Commission"
            ],
            colors: ["#299AE5", "#BC9491", "#63EA83", "#FF8B00", "#6C95BA"],
            // legend: {
            //     show: true,
            //     position: "bottom",
            //     fontSize: '9px'
            // },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

    chartAction(chartType, index) {
        console.log(index);

        if (chartType == 'barChartApprovedProject') {
            if (index == 0) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.dppProjectList));
            } else if (index == 1) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.tappProjectList));
            } else if (index == 2) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.rdppProjectList));
            } else if (index == 3) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.rtappProjectList));
            }
        } else if (chartType == 'barChartUnapprovedProject') {
            if (index == 0) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.dppUnapprovedProjectList));
            } else if (index == 1) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.tappUnapprovedProjectList));
            } else if (index == 2) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.rdppUnapprovedProjectList));
            } else if (index == 3) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.rtappUnapprovedProjectList));
            }
        } else if (chartType == 'pieChartFeasibility') {
            if (index == 0) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel?.fsCompleteProjectList));
            } else if (index == 1) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel?.fsNotCompleteProjectList));
            }
        } else if (chartType == 'pieChartRecommended') {
            console.log(this.agencyDashboardModel)
            if (index == 0) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel.pecProjectList));
            } else if (index == 1) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel.notPreparedProjectList));
            } else if (index == 2) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel.preparedProjectList));
            } else if (index == 3) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel.pscProjectList));
            } else if (index == 4) {
                this.commonDatasource = new MatTableDataSource(this.arrangeData(this.agencyDashboardModel.atPCProjectList));
            }
        }

        this.commonTotalElement =this.commonDatasource?.filteredData?.length;
        this.plancomDashbord = false;
        this.plancomListPage = true;
    }

  barChartApprovedProject() {
      this.approvedBarChartOptions = {
          series: [
              {
                  name: "Total",
                  data: [this.dppProjectList?.length, this.tappProjectList?.length, this.rdppProjectList?.length, this.rtappProjectList?.length]
              },
          ],
          chart: {
              type: "bar",
              height: 300,
              events: {
                  dataPointSelection: (event: any, chartContext: any, config: any) => {
                      this.chartAction( 'barChartApprovedProject', config.dataPointIndex);
                  },
                  dataPointMouseEnter: function(event) {
                      event.target.style.cursor = "pointer";
                      // event.path[0].style.cursor = "pointer";
                      // event.fromElement.style.cursor = "pointer";
                  }
              },
          },
          plotOptions: {
              bar: {
                  barHeight: "55%",
                  distributed: true,
                  horizontal: true,
                  dataLabels: {
                      position: "bottom"
                  }
              }
          },
          colors: ["#38B76A", "#D96638", "#58D7E5", "#C5D02C"],
          dataLabels: {
              enabled: false
          },
          xaxis: {
              categories: ["DPP", "TAPP", "RDPP", "RTAPP"]
          }
      };
  }

  reloadApproved() {
      console.log("calling")
      if (this.appFromDate == null || this.appToDate == null) {
          return;
      }
      let isValidFrom = moment(this.appFromDate, 'YYYY-MM-DD', true).isValid();
      let isValidTo = moment(this.appToDate, 'YYYY-MM-DD', true).isValid();
      if (isValidFrom && isValidTo) {
          const fromDate = moment(this.appFromDate).format('YYYY-MM-DD');
          const toDate = moment(this.appToDate).format('YYYY-MM-DD');

          this.dppProjectList = this.dppProjectListStore.filter(f => {
              const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
              return createdDate >= fromDate && createdDate <= toDate;
          });
          this.tappProjectList = this.tappProjectListStore.filter(f => {
              const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
              return createdDate >= fromDate && createdDate <= toDate;
          });
          this.rdppProjectList = this.rdppProjectListStore.filter(f => {
              const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
              return createdDate >= fromDate && createdDate <= toDate;
          });
          this.rtappProjectList = this.rtappProjectListStore.filter(f => {
              const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
              return createdDate >= fromDate && createdDate <= toDate;
          });
          this.barChartApprovedProject();
      } else {
          this.dppProjectList = this.dppProjectListStore;
          this.tappProjectList = this.tappProjectListStore;
          this.rdppProjectList = this.rdppProjectListStore;
          this.rtappProjectList = this.rtappProjectListStore;
          this.barChartApprovedProject();
          return;
      }
  }

    reloadUnapproved() {
        console.log("calling")
        if (this.unAppFromDate == null || this.unAppToDate == null) {
            return;
        }
        let isValidFrom = moment(this.unAppFromDate, 'YYYY-MM-DD', true).isValid();
        let isValidTo = moment(this.unAppToDate, 'YYYY-MM-DD', true).isValid();
        if (isValidFrom && isValidTo) {
            const fromDate = moment(this.unAppFromDate).format('YYYY-MM-DD');
            const toDate = moment(this.unAppToDate).format('YYYY-MM-DD');

            this.dppUnapprovedProjectList = this.dppUnapprovedProjectListStore.filter(f => {
                const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
                return createdDate >= fromDate && createdDate <= toDate;
            });
            this.tappUnapprovedProjectList = this.tappUnapprovedProjectListStore.filter(f => {
                const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
                return createdDate >= fromDate && createdDate <= toDate;
            });
            this.rdppUnapprovedProjectList = this.rdppUnapprovedProjectListStore.filter(f => {
                const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
                return createdDate >= fromDate && createdDate <= toDate;
            });
            this.rtappUnapprovedProjectList = this.rtappUnapprovedProjectListStore.filter(f => {
                const createdDate = moment(f.createdDate).format('YYYY-MM-DD');
                return createdDate >= fromDate && createdDate <= toDate;
            });
            this.barChartUnapprovedProject();
        } else {
            this.dppUnapprovedProjectList = this.dppUnapprovedProjectListStore;
            this.tappUnapprovedProjectList = this.tappUnapprovedProjectListStore;
            this.rdppUnapprovedProjectList = this.rdppUnapprovedProjectListStore;
            this.rtappUnapprovedProjectList = this.rtappUnapprovedProjectListStore;
            this.barChartUnapprovedProject();
            return;
        }
    }

  barChartUnapprovedProject() {
      this.unapprovedBarChartOptions = {
          series: [
              {
                  name: "Total",
                  data: [this.dppUnapprovedProjectList?.length, this.tappUnapprovedProjectList?.length, this.rdppUnapprovedProjectList?.length,
                      this.rtappUnapprovedProjectList?.length]
              },
          ],
          chart: {
              type: "bar",
              height: 300,
              events: {
                  dataPointSelection: (event: any, chartContext: any, config: any) => {
                      this.chartAction( 'barChartUnapprovedProject', config.dataPointIndex);
                  },
                  dataPointMouseEnter: function(event) {
                      event.target.style.cursor = "pointer";
                      // event.path[0].style.cursor = "pointer";
                      // event.fromElement.style.cursor = "pointer";
                  }
              },
          },
          plotOptions: {
              bar: {
                  barHeight: "55%",
                  distributed: true,
                  horizontal: true,
                  dataLabels: {
                      position: "bottom"
                  }
              }
          },
          colors: ["#38B76A", "#D96638", "#58D7E5", "#C5D02C"],
          dataLabels: {
              enabled: false
          },
          xaxis: {
              categories: ["DPP", "TAPP", "RDPP", "RTAPP"]
          }
      };
  }

}
