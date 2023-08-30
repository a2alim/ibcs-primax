import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
// import * as Highcharts from 'highcharts';
// import highcharts3D from 'highcharts/highcharts-3d';
import {
    ApexAxisChartSeries,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexDataLabels,
    ApexPlotOptions,
    ApexStroke,
    ApexTheme,
    ApexTitleSubtitle,
    ApexXAxis,
    ChartComponent
} from "ng-apexcharts";
// import {HighchartsChartComponent} from "highcharts-angular";
import {AgencyDashboardModel} from "../../../models/agency-dashboard.model";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {AgencyDashboardService} from "../../../services/agency-dashboard.service";
import {environment} from "../../../../../../../environments/environment";
import {Router} from "@angular/router";
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import {locale as lngEnglish} from "../agency-dashboard/i18n/en";
import {locale as lngBangla} from "../agency-dashboard/i18n/bn";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {EcnecMeetingModel} from "../../../../dpp-tapp-management/models/ecnec-meeting.model";
import {SectorDivisionModel} from "../../../../configuration-management/models/sector-division.model";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {DppObjectiveCostModel} from "../../../../dpp-tapp-management/models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../../dpp-tapp-management/models/tappObjectiveCost.model";
import {IProjectConcept} from "../../../models/project-concept";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EcnecMeetingService} from "../../../../dpp-tapp-management/services/ecnec-meeting.service";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
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
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {map, switchMap} from "rxjs/operators";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {LayoutHelperService} from "../../../../../../layout/layouts/vertical/services/layout-helper.service";
import {DomSanitizer} from '@angular/platform-browser';
// highcharts3D(Highcharts);

export type ChartOptions = {
    series: ApexAxisChartSeries;
    seriesNonAxis: ApexNonAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    theme: ApexTheme;
    xaxis: ApexXAxis;
    colors: string[];
    labels: any;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-agency-dashboard',
    templateUrl: './agency-dashboard.component.html',
    styleUrls: ['./agency-dashboard.component.scss']
})
export class AgencyDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('projectTotalChart') chartTotalProject: ChartComponent;
    public chartOptionsTotalProject: Partial<ChartOptions>;

    @ViewChild('recommendedProject') chartRecommendedStatus: ChartComponent;
    public chartOptionsRecommendedStatus: Partial<ChartOptions>;

    @ViewChild('fsChart') chartFsStatus: ChartComponent;
    public chartOptionsFs: Partial<ChartOptions>;

    // @ViewChild('recommendedProject') chartRecommendedStatus: HighchartsChartComponent;
    // public chartOptionsRecommendedStatus: any;
    // highcharts = Highcharts;

    navigationPage = environment.ibcs.navigateToUui;

    // FS Chart Property
    // fsStatusData: any;

    @ViewChild("ongoingChart") chartOngoing: ChartComponent;
    public chartOngoingOptions: Partial<ChartOptions>;

    agencyDashboardModel: AgencyDashboardModel = new AgencyDashboardModel();
    spinner: boolean;
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
    approvedProjects: any;
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

    constructor(private agencyDashboardService: AgencyDashboardService,
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
                private route: Router,
                private router: Router) {
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

    private getAllApi() {
        this.spinner = true;
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
        console.log("searchByCriteria,,,,,,,,,,,")
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
                    console.log("project List,,,,,,,,,,",this.projectList)
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
        this.approvedProjects = this.projectList.filter(sdp=>
            sdp.status==ProjectMovementStageConstant.ECNEC_APPROVED ||
            sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED);
        this.totalApproved = this.approvedProjects.length;
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
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInAgency));
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

    projectDataSourceBySectorId(sectorId){
        this.plancomDashbord = false;
        this.plancomListPage = true;
        this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectList.filter(f => f.sectorId == sectorId)));
        this.commonTotalElement =this.commonDatasource?.filteredData?.length;
    }

    private arrangeData(res: IProjectConcept[]) {
        return res.map(m => ({
            ...m,
            movementStatus: m.status ? m.status== 'ECNEC_OFFICERS' ? "ECNEC WINGS": m.status.split('_').join(' ') : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList.filter(e => e.id === m.sectorDivisionId).map(m => m.sectorDivisionNameEn),
            titleEn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleEn(m, this.dppObjectiveAndCostList) : this.getTitleEn(m, this.tappObjectiveAndCostList),
            titleBn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleBn(m, this.dppObjectiveAndCostList) : this.getTitleBn(m, this.tappObjectiveAndCostList),
            commencementDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCommencementDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCommencementDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy'),
            completionDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCompletionDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCompletionDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy')
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
                this.initTotalProjectChart();
                this.showFsChart();
                this.showRecommendedStatusChart();
                this.initOngoingChart()
                this.spinner = false;
            })
        );
    }

    // private setData(res: AgencyDashboardModel) {
    //     this.agencyDashboardModel.totalProjects = res.totalProjects ? res.totalProjects : 0;
    //     this.agencyDashboardModel.approvedProjects = res.approvedProjects ? res.approvedProjects : 0;
    //     this.agencyDashboardModel.runningProject = res.runningProject ? res.runningProject : 0;
    //     this.agencyDashboardModel.sendToMinistryDivision = res.sendToMinistryDivision ? res.sendToMinistryDivision : 0;
    //     this.agencyDashboardModel.sendToPlanningCommission = res.sendToPlanningCommission ? res.sendToPlanningCommission : 0;
    //     this.agencyDashboardModel.fsNotComplete = res.fsNotComplete ? this.agencyDashboardModel.fsNotComplete : 0;
    //     this.agencyDashboardModel.fsComplete = res.fsComplete ? this.agencyDashboardModel.fsComplete : 0;
    //     this.agencyDashboardModel.rtapp = res.rtapp ? this.agencyDashboardModel.rtapp : 0;
    //     this.agencyDashboardModel.rdpp = res.rdpp ? this.agencyDashboardModel.rdpp : 0;
    //     this.agencyDashboardModel.tapp = res.tapp ? this.agencyDashboardModel.tapp : 0;
    //     this.agencyDashboardModel.dpp = res.dpp ? this.agencyDashboardModel.dpp : 0;
    //     console.log(this.agencyDashboardModel);
    // }

    // private fsStatusChart() {
    //     this.fsStatusData = [
    //         ['Completed', this.agencyDashboardModel.fsComplete],
    //         ['InCompleted', this.agencyDashboardModel.fsNotComplete]
    //     ];
    // }

    private initOngoingChart() {
        this.chartOngoingOptions = {
            series: [
                {
                    name: "Allocation",
                    data: [44, 55, 41, 64, 22, 43, 21]
                },
                {
                    name: "Expense",

                    data: [53, 32, 33, 52, 13, 44, 32]
                }
            ],
            chart: {
                type: "bar",
                height: 300
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        position: "top"
                    }
                }
            },
            colors: ["#b4ce39", "#f56963"],
            dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                    fontSize: "12px",
                    colors: ["#fff"]
                }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ["#fff"]
            },
            xaxis: {
                categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
            }
        };
    }

    private initTotalProjectChart() {
        this.chartOptionsTotalProject = {
            series: [
                {
                    name: "",
                    data: [this.agencyDashboardModel?.dpp, this.agencyDashboardModel?.tapp, this.agencyDashboardModel?.rdpp, this.agencyDashboardModel?.rtapp]
                }
            ],
            chart: {
                type: "bar",
                height: 480
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: "bottom"
                    }
                }
            },
            colors: ["#f7ba16", "#b4ce39", "#03bcd0", "#adc5e4"],
            dataLabels: {
                enabled: true,
                textAnchor: "start",
                style: {
                    colors: ["#000000"],
                    fontWeight: 450
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            xaxis: {
                categories: [
                    "DPP",
                    "TAPP",
                    "RDPP",
                    "RTAPP"
                ]
            }
        };
    }

    private showFsChart() {
        this.chartOptionsFs = {
            seriesNonAxis: [this.agencyDashboardModel?.fsComplete, this.agencyDashboardModel?.fsNotComplete],
            chart: {
                type: "pie",
                width: 350,
                height: 350
            },
            colors: ["#0e962b", "#f60808"],
            labels: ["Completed", "Not Completed"],
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

    private showRecommendedStatusChart() {
        this.chartOptionsRecommendedStatus = {
            seriesNonAxis: [this.agencyDashboardModel.pecMeetingHeld, this.agencyDashboardModel.dppNotPrepared, this.agencyDashboardModel.dppPrepared, this.agencyDashboardModel.pscMeetingHeld, this.agencyDashboardModel.dppAtPC],
            chart: {
                type: "pie",
                width: 520,
                height: 460
            },
            colors: ["#299AE5", "#BC9491", "#63EA83", "#FF8B00", "#6C95BA"],
            labels: [
                "PEC Meeting Held",
                "DPP not Prepared",
                "DPP Prepared",
                "Project Security Committee Meeting Held",
                "DPP Received at Planning Commission"
            ],
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

    // private showRecommendedStatusChart() {
    // this.chartOptionsRecommendedStatus = {
    //     chart: {
    //         type: 'pie',
    //         options3d: {
    //             enabled: true,
    //             alpha: 45,
    //             beta: 0
    //         }
    //     },
    //     title : {
    //         text: ''
    //     },
    //     tooltip: {
    //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //     },
    //     plotOptions: {
    //         pie: {
    //             allowPointSelect: true,
    //             cursor: 'pointer',
    //             depth: 35,
    //             dataLabels: {
    //                 enabled: true,
    //                 format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
    //                 style: {
    //                     color: (Highcharts.theme) ||
    //                         'black'
    //                 }
    //             }
    //         }
    //     },
    //     series: [{
    //         type: 'pie',
    //         name: 'Browser share',
    //         data: [
    //             ['DPP Prepared', 23.0],
    //             ['PEC Meeting Held', 26.8],
    //             {
    //                 name: 'Project Scrutiny Committee Meeting Held',
    //                 y: 12.8,
    //                 sliced: true,
    //                 selected: true
    //             },
    //             ['DPP Received at Planning Commission', 8.5],
    //             ['DPP not Prepared', 6.2]
    //         ]
    //     }]
    // };
    // }

    goToDppList() {
        this.router.navigate(['/dpp-tapp']);
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
        this.route.navigate([`gis-map-dashboard`]);
    }
}
