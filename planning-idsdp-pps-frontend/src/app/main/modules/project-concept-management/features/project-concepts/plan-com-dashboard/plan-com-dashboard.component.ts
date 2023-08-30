import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyDashboardService } from "../../../services/agency-dashboard.service";
import { EcnecMeetingService } from "../../../../dpp-tapp-management/services/ecnec-meeting.service";
import { NumberPipe } from "../../../../../shared/pipes/number-pipe.pipe";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { AssingEcnecMeetingService } from "../../../../dpp-tapp-management/services/assign-ecnec-meeting.service";
import { ProjectSummaryService } from "../../../services/project-summary.service";
import { SectorService } from "../../../../configuration-management/services/sector.service";
import { DppObjectiveCostService } from "../../../../dpp-tapp-management/services/dpp-objective-cost.service";
import { TappObjectiveCostService } from "../../../../dpp-tapp-management/services/tapp-objective-cost.service";
import { SectorDivisionService } from "../../../../configuration-management/services/sector-division.service";
import { FileUploadService } from "../../../../../core/services/file-upload.service";
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { MatDialog } from "@angular/material/dialog";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { locale as lngEnglish } from "../plan-com-dashboard/i18n/en";
import { locale as lngBangla } from "../plan-com-dashboard/i18n/bn";
import { UserGroupService } from "../../../../configuration-management/services/user-group.service";
import { SectorModel } from "../../../../configuration-management/models/sector.model";
import { FormControl, FormGroup } from "@angular/forms";
import { map, switchMap } from "rxjs/operators";
import { CommentSourceEnum } from "../../../enums/comment-source.enum";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { IProjectConcept } from "../../../models/project-concept";
import { EcnecMeetingModel } from "../../../../dpp-tapp-management/models/ecnec-meeting.model";
import { AssignEcnecMeetingListModel } from "../../../../dpp-tapp-management/models/assign-ecnec-meeting-list.model";
import { IMinistryDivision } from "../../../../configuration-management/models/ministry-divisiont";
import { SectorDivisionModel } from "../../../../configuration-management/models/sector-division.model";
import { DppObjectiveCostModel } from "../../../../dpp-tapp-management/models/dppObjectiveCost.model";
import { TappObjectiveCostModel } from "../../../../dpp-tapp-management/models/tappObjectiveCost.model";
import { DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE } from "../../../../../core/constants/constant";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectMovementStageConstant } from 'app/main/modules/dpp-tapp-management/constants/project-movement-stage-constant';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexXAxis, ChartComponent
} from "ng-apexcharts";
import { AgencyDashboardModel } from "../../../models/agency-dashboard.model";
import { environment } from "../../../../../../../environments/environment";
import { LayoutHelperService } from "../../../../../../layout/layouts/vertical/services/layout-helper.service";
import { TranslateService } from '@ngx-translate/core';

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
    selector: 'app-plan-com-dashboard',
    templateUrl: './plan-com-dashboard.component.html',
    styleUrls: ['./plan-com-dashboard.component.scss']
})
export class PlanComDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('projectTotalChart') chartTotalProject: ChartComponent;
    public chartOptionsTotalProject: Partial<ChartOptions>;

    @ViewChild('recommendedProject') chartRecommendedStatus: ChartComponent;
    public chartOptionsRecommendedStatus: Partial<ChartOptions>;


    displayedColumnsPCList: string[] = ['sl', 'projectName', 'total', 'gob', 'ownFund', 'other'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    dataSource: MatTableDataSource<EcnecMeetingModel>;
    sectorDivisionList: Array<SectorDivisionModel>;
    sectorList: Array<SectorModel>;
    dppObjectiveAndCostList: DppObjectiveCostModel[] = [];
    tappObjectiveAndCostList: TappObjectiveCostModel[] = [];
    ecnectMeetingList: EcnecMeetingModel[] = [];
    actionPermission = [];
    commonDatasource: MatTableDataSource<IProjectConcept>;
    awaitingDatasource: MatTableDataSource<IProjectConcept>;
    conditionalDataSource: MatTableDataSource<IProjectConcept>;
    awaitingDatasource1: MatTableDataSource<IProjectConcept>;
    conditionalDataSource1: MatTableDataSource<IProjectConcept>;
    awaitingDatasource2: MatTableDataSource<IProjectConcept>;
    conditionalDataSource2: MatTableDataSource<IProjectConcept>;
    awaitingDatasource3: MatTableDataSource<IProjectConcept>;
    conditionalDataSource3: MatTableDataSource<IProjectConcept>;
    awaitingDatasource4: MatTableDataSource<IProjectConcept>;
    conditionalDataSource4: MatTableDataSource<IProjectConcept>;
    awaitingElement: number;
    conditionalElement: number;
    awaitingElement1: number;
    conditionalElement1: number;
    awaitingElement2: number;
    conditionalElement2: number;
    awaitingElement3: number;
    conditionalElement3: number;
    awaitingElement4: number;
    conditionalElement4: number;
    total: number;
    disableDelete: boolean;
    size: number = MAX_PAGE_SIZE;
    page: number = DEFAULT_PAGE;
    sectorDivisionName: string;
    sectorDivision: any = {};
    sectorModel: SectorModel[] = [];
    spinner: boolean;
    private form: any;
    projectList: any = [];
    otherStatus: any = [];
    plancomListPage: boolean = false;
    plancomDashbord: boolean = true;
    commonTotalElement: number;
    // @ViewChild("ongoingChart") chartOngoing: ChartComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    sectorDivisionTotalProject: any;
    sectorDivisionProjects: any = [];
    totalProjectsInEcnec: any;
    projectsInEcnec: any;
    totalProjectsInPlancomm: any;
    projectsInPlancomm: any;
    totalApproved: any;
    totalConditionalApproved: any;
    approvedProjects: any;
    conditionalApprovedProjects: any;
    totalProjectsInMinistry: any;
    projectsInMinistry: any;
    loadAmount: boolean = false;
    currentLanguage: any;

    constructor(
        private ecnecMeetingService: EcnecMeetingService,
        public numberPipe: NumberPipe,
        private router: Router,
        private datePipe: DatePipe,
        private assignMeetingService: AssingEcnecMeetingService,
        private projectSummaryService: ProjectSummaryService,
        private sectorService: SectorService,
        private dppObjectiveCostService: DppObjectiveCostService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private sectorDivisionService: SectorDivisionService,
        private fileUploadService: FileUploadService,
        private snackbarHelper: SnackbarHelper,
        private userGroupService: UserGroupService,
        private dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private layoutHelperService: LayoutHelperService,
        private route: Router
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.layoutHelperService.changeNavLanguage('bn');
        this.layoutHelperService.setLanguageEvent('bn')
    }

    ngOnInit(): void {

        console.log('currentLanguage', this.currentLanguage);
        // this.layoutHelperService.currentLanguage.subscribe(ln => {
        //     this.currentLanguage = ln;
        //     this.layoutHelperService.changeNavLanguage(ln);
        //     this.layoutHelperService.setLanguageEvent(ln === 'en' ? 'en' : 'bn')
        //     console.log('_fuseTranslationLoaderService.getActiveLang', this._fuseTranslationLoaderService.getActiveLang())
        //     console.log('layoutHelperService.currentLanguage', ln);
        // })
        this.populateForm();
        this.getUserGroup();
        this.spinner = true;
        this.loadData();
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.getUserInfoByUserId(res.res.userId);
        })
    }

    getSectorsBySectorDivisionId(sectorDivisionID) {
        this.sectorService.getBySectorDivisionId(sectorDivisionID).subscribe(res => {
            this.sectorModel = res;
            this.getAllApi();
        })
    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.sectorDivision = res.sectorDivision;
            this.sectorDivisionName = res.sectorDivision.sectorDivisionNameBn;
            this.getSectorsBySectorDivisionId(res.sectorDivision.id);

        })
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
                                    ecnecMeetingList: ecnecMeeting
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
                this.ecnectMeetingList = res.ecnecMeetingList;
                this.searchByCriteria();
            }, error => this.spinner = false)
        )
    }

    /**
     * This is a Criteria base Search function.
     * @author Siddiquer Rahman
     * @version 1.0.0
     * @return {awaitingDatasource} Return list of all awaiting or ecnec desk projects
     * @return {awaitingDatasource1} Return list of Socio-Economic Infrastructure Division wise projects
     * @return {awaitingDatasource2} Return list of Agriculture, Water Resource and Rural Infrastructure Division wise projects
     * @return {awaitingDatasource3} Return list of Industry and Power Division wise projects
     * @return {awaitingDatasource4} Return list of Physical Infrastructure Division wise projects
     * @return {awaitingElement} Return total awaiting projects
     * @return {awaitingElement1} Return total Socio-Economic Infrastructure Division projects
     * @return {awaitingElement2} Return total Agriculture, Water Resource and Rural Infrastructure Division projects
     * @return {awaitingElement3} Return total Industry and Power Division projects
     * @return {awaitingElement4} Return total Physical Infrastructure Division projects
     * @return {conditionalDataSource} Return list of all conditional approve projects
     * @return {conditionalDataSource1} Return list of Socio-Economic Infrastructure Division wise projects
     * @return {conditionalDataSource2} Return list of Agriculture, Water Resource and Rural Infrastructure Division wise projects
     * @return {conditionalDataSource3} Return list of Industry and Power Division wise projects
     * @return {conditionalDataSource4} Return list of Physical Infrastructure Division wise projects
     * @return {conditionalElement} Return total awaiting projects
     * @return {conditionalElement1} Return total Socio-Economic Infrastructure Division projects
     * @return {conditionalElement2} Return total Agriculture, Water Resource and Rural Infrastructure Division projects
     * @return {conditionalElement3} Return total Industry and Power Division projects
     * @return {conditionalElement4} Return total Physical Infrastructure Division projects
     *
     **/
    searchByCriteria() {
        // this.spinner = true;
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
                        this.projectList = res.content;
                        this.findProjectBySector();
                        // this.awaitingDatasource = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK')));
                        // this.conditionalDataSource = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE')));
                        // this.awaitingDatasource1 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==1)));
                        // this.conditionalDataSource1 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==1)));
                        // this.awaitingDatasource2 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==2)));
                        // this.conditionalDataSource2 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==2)));
                        // this.awaitingDatasource3 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==3)));
                        // this.conditionalDataSource3 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==3)));
                        // this.awaitingDatasource4 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==4)));
                        // this.conditionalDataSource4 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==4)));
                        // this.awaitingElement = this.awaitingDatasource.filteredData.length;
                        // this.conditionalElement = this.conditionalDataSource.filteredData.length;
                        // this.awaitingElement1 = this.awaitingDatasource1.filteredData.length;
                        // this.conditionalElement1 = this.conditionalDataSource1.filteredData.length;
                        // this.awaitingElement2 = this.awaitingDatasource2.filteredData.length;
                        // this.conditionalElement2 = this.conditionalDataSource2.filteredData.length;
                        // this.awaitingElement3 = this.awaitingDatasource3.filteredData.length;
                        // this.conditionalElement3 = this.conditionalDataSource3.filteredData.length;
                        // this.awaitingElement4 = this.awaitingDatasource4.filteredData.length;
                        // this.conditionalElement4 = this.conditionalDataSource4.filteredData.length;

                        this.total = res.totalElements;
                        console.log(this.awaitingDatasource)
                        this.loadAmount = false;
                    },
                    error => {
                        // this.spinner = false;
                        console.log('error ', error);
                    }
                )
        );
    }

    findProjectBySector() {
        this.sectorModel.forEach(sector => {
            sector.totalProject = this.projectList.filter(f => f.sectorId == sector.id).length;
        })
        this.sectorDivisionProjects = this.projectList.filter(f => f.sectorDivisionId == this.sectorDivision.id);
        this.sectorDivisionTotalProject = this.sectorDivisionProjects.length;
        this.findInEcnecTotal();
        this.findInMinistryTotal();
        this.findApprovedTotal();
        this.findConditionalApprovedTotal();
        this.findPlancommTotal();
    }

    findInEcnecTotal() {
        this.projectsInEcnec = this.sectorDivisionProjects.filter(sdp => sdp.status == ProjectMovementStageConstant.IN_ECNEC || sdp.status == ProjectMovementStageConstant.ECNEC_DESK || sdp.status == ProjectMovementStageConstant.ECNEC_OFFICERS);
        this.totalProjectsInEcnec = this.projectsInEcnec.length;
    }

    findInMinistryTotal() {
        this.projectsInMinistry = this.sectorDivisionProjects.filter(sdp => sdp.status == ProjectMovementStageConstant.MINISTRY_DESK || sdp.status == ProjectMovementStageConstant.MINISTRY_HEAD || sdp.status == ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY || sdp.status == ProjectMovementStageConstant.DPEC_MEETING_HELD || sdp.status == ProjectMovementStageConstant.DPEC_MEETING_NOTICE || sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_HELD || sdp.status == ProjectMovementStageConstant.DSPEC_MEETING_NOTICE || sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD || sdp.status == ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE);
        this.totalProjectsInMinistry = this.projectsInMinistry.length;
    }

    findApprovedTotal() {
        this.approvedProjects = this.sectorDivisionProjects.filter(sdp => sdp.status == ProjectMovementStageConstant.ECNEC_APPROVED || sdp.status == ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED);
        this.totalApproved = this.approvedProjects.length;
    }

    findConditionalApprovedTotal() {
        this.conditionalApprovedProjects = this.sectorDivisionProjects.filter(sdp => sdp.status == ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE);
        this.totalConditionalApproved = this.conditionalApprovedProjects.length;
    }

    findPlancommTotal() {
        this.projectsInPlancomm = this.sectorDivisionProjects.filter(sdp => sdp.status == ProjectMovementStageConstant.PLANNING_COMMISSION_DESK || sdp.status == ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD || sdp.status == ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM);
        this.totalProjectsInPlancomm = this.projectsInPlancomm.length;
        // this.spinner = false;
    }

    viewForwardProjects(status) {
        if (status == 'ACNEC') {
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInEcnec));
        }
        if (status == 'MINISTRY') {
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInMinistry));
        }
        if (status == 'APPROVED') {
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.approvedProjects));
        }
        if (status == 'PLANCOM') {
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectsInPlancomm));
        }
        if (status == 'CONDITIONAL-APPROVED') {
            this.commonDatasource = new MatTableDataSource(this.arrangeData(this.conditionalApprovedProjects));
        }
        this.commonTotalElement = this.commonDatasource?.filteredData?.length;
        this.plancomDashbord = false;
        this.plancomListPage = true;
    }

    projectDataSourceBySectorId(sectorId) {
        this.plancomDashbord = false;
        this.plancomListPage = true;
        this.commonDatasource = new MatTableDataSource(this.arrangeData(this.projectList.filter(f => f.sectorId == sectorId)));
        this.commonTotalElement = this.commonDatasource?.filteredData?.length;
    }

    private arrangeData(res: IProjectConcept[]) {
        return res.map(m => ({
            ...m,
            movementStatus: m.status ? m.status == 'ECNEC_OFFICERS' ? "ECNEC WINGS" : m.status.split('_').join(' ') : 'AGENCY DESK',
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

    // For calling list during page change
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex;
    }

    backToDashbord() {
        this.plancomDashbord = true;
        this.plancomListPage = false;
    }

    gotToViewDashboard(uuid) {
        this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
    }

    private loadData() {
        this.initTotalProjectChart();
        this.showRecommendedStatusChart();
        this.spinner = false;
    }

    private initTotalProjectChart() {
        this.chartOptionsTotalProject = {
            series: [
                {
                    name: "",
                    data: [2, 3, 4, 7]
                }
            ],
            chart: {
                type: "bar",
                height: 280
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
                    fontWeight: 400
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


    private showRecommendedStatusChart() {
        this.chartOptionsRecommendedStatus = {
            seriesNonAxis: [3, 5, 8, 9, 1],
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
                "Project Scrutiny Committee Meeting Held",
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

    navigateToMap() {
        this.route.navigate([`gis-map-dashboard`]);
    }
}
