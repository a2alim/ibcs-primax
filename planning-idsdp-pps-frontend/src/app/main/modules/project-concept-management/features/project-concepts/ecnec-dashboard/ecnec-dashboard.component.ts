import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {environment} from "../../../../../../../environments/environment";
import {AgencyDashboardModel} from "../../../models/agency-dashboard.model";
import {AgencyDashboardService} from "../../../services/agency-dashboard.service";
import {Router} from "@angular/router";
import {ChartOptions} from "../agency-dashboard/agency-dashboard.component";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {EcnecMeetingModel} from "../../../../dpp-tapp-management/models/ecnec-meeting.model";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from "../../../../../core/constants/constant";
import {EcnecMeetingService} from "../../../../dpp-tapp-management/services/ecnec-meeting.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NumberPipe} from "../../../../../shared/pipes/number-pipe.pipe";
/*----Lng Translation----*/
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {MatDialog} from "@angular/material/dialog";
import {AssignEcnecMeetingListModel} from "../../../../dpp-tapp-management/models/assign-ecnec-meeting-list.model";
import {AssingEcnecMeetingService} from "../../../../dpp-tapp-management/services/assign-ecnec-meeting.service";
import {DatePipe} from "@angular/common";
import {ProjectSummaryService} from "../../../services/project-summary.service";
import {map, switchMap} from "rxjs/operators";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {SectorDivisionService} from "../../../../configuration-management/services/sector-division.service";
import {SectorDivisionModel} from "../../../../configuration-management/models/sector-division.model";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {IProjectConcept} from "../../../models/project-concept";
import {DppObjectiveCostService} from "../../../../dpp-tapp-management/services/dpp-objective-cost.service";
import {TappObjectiveCostService} from "../../../../dpp-tapp-management/services/tapp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../../dpp-tapp-management/models/dppObjectiveCost.model";
import {TappObjectiveCostModel} from "../../../../dpp-tapp-management/models/tappObjectiveCost.model";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {FileUploadService} from "../../../../../core/services/file-upload.service";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";

@Component({
  selector: 'app-ecnec-dashboard',
  templateUrl: './ecnec-dashboard.component.html',
  styleUrls: ['./ecnec-dashboard.component.scss']
})
export class EcnecDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
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
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    public chartOngoingOptions: Partial<ChartOptions>;

    agencyDashboardModel: AgencyDashboardModel = new AgencyDashboardModel();
    spinner: boolean;


    displayedColumns: string[] = ['sl', 'meetingName', 'meetingDate', 'status', 'action'];

    displayedColumnsPCList: string[] = ['sl', 'projectName', 'total', 'gob', 'ownFund', 'other'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    displayedColumnsEcnec: string[] = ['sl', 'projectName', 'total', 'gob', 'ownFund', 'other'];
    displayedColumns2Ecnec: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    dataSource: MatTableDataSource<EcnecMeetingModel>;
    projectListDataSource: MatTableDataSource<AssignEcnecMeetingListModel>;
    ministryDivisions: IMinistryDivision[] = [];
    // ministryDivisions: IOption[] = [];
    sectorDivisionList: Array<SectorDivisionModel>;
    sectorList: Array<SectorModel>;
    dppObjectiveAndCostList: DppObjectiveCostModel[] = [];
    tappObjectiveAndCostList: TappObjectiveCostModel[] = [];
    ecnectMeetingList: EcnecMeetingModel[] = [];
    form: any;
    actionPermission = [];
    commonDatasource: MatTableDataSource<IProjectConcept>;
    commonTotalElement: number;
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
    // conditionalElement: number;
    conditionalElement: number;
    awaitingElement1: number;
    // conditionalElement1: number;
    conditionalElement1: number;
    awaitingElement2: number;
    // conditionalElement2: number;
    conditionalElement2: number;
    awaitingElement3: number;
    // conditionalElement3: number;
    conditionalElement3: number;
    awaitingElement4: number;
    // conditionalElement4: number;
    conditionalElement4: number;
    total: number;
    disableDelete: boolean;
    size: number = MAX_PAGE_SIZE;
    page: number = DEFAULT_PAGE;
    private meetingId: number;
    private meetingName: string;
    ecnecDashbord: boolean = true;
    sectorListPage: boolean = false;



    constructor(private agencyDashboardService: AgencyDashboardService,
                private ecnecMeetingService: EcnecMeetingService,
                public numberPipe : NumberPipe,
                private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private router: Router,
                private datePipe: DatePipe,
                private assignMeetingService : AssingEcnecMeetingService,
                private projectSummaryService: ProjectSummaryService,
                private sectorService: SectorService,
                private dppObjectiveCostService: DppObjectiveCostService,
                private tappObjectiveCostService: TappObjectiveCostService,
                private sectorDivisionService: SectorDivisionService,
                private fileUploadService: FileUploadService,
                private snackbarHelper : SnackbarHelper,
                private dialog: MatDialog,
                private route: Router) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.populateForm();
        this.loadData();
        this.getEcnecMeeting();
        this.getAllApi();
    }


    download(data: any) {
        if(data.fileUrl){
            this.fileUploadService.downloadAttachmentInDppService(data.fileUrl);
        }else{
            this.snackbarHelper.openErrorSnackBarWithMessage('Please attachment upload first!','ERR')
        }
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
        this.spinner = true;
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

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.DPP, this.page, this.size).subscribe(res => {

                    this.awaitingDatasource = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK')));
                    this.conditionalDataSource = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE')));
                    this.awaitingDatasource1 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==1)));
                    this.conditionalDataSource1 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==1)));
                    this.awaitingDatasource2 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==2)));
                    this.conditionalDataSource2 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==2)));
                    this.awaitingDatasource3 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==3)));
                    this.conditionalDataSource3 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==3)));
                    this.awaitingDatasource4 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_DESK').filter(f => f.sectorDivisionId ==4)));
                    this.conditionalDataSource4 = new MatTableDataSource(this.arrangeData(res.content.filter(f => f.status == 'ECNEC_CONDITIONAL_APPROVE').filter(f => f.sectorDivisionId ==4)));
                    this.awaitingElement = this.awaitingDatasource.filteredData.length;
                    this.conditionalElement = this.conditionalDataSource.filteredData.length;
                    this.awaitingElement1 = this.awaitingDatasource1.filteredData.length;
                    this.conditionalElement1 = this.conditionalDataSource1.filteredData.length;
                    this.awaitingElement2 = this.awaitingDatasource2.filteredData.length;
                    this.conditionalElement2 = this.conditionalDataSource2.filteredData.length;
                    this.awaitingElement3 = this.awaitingDatasource3.filteredData.length;
                    this.conditionalElement3 = this.conditionalDataSource3.filteredData.length;
                    this.awaitingElement4 = this.awaitingDatasource4.filteredData.length;
                    this.conditionalElement4 = this.conditionalDataSource4.filteredData.length;

                this.total = res.totalElements;
                this.spinner = false;
                console.log(this.awaitingDatasource)
            }, error => this.spinner = false)
        );
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

    gotToViewDashboard(row) {
        this.router.navigate([`dpp-tapp/view-dashboard/${row}`]);
    }

    edit(row: EcnecMeetingModel) {
        this.router.navigate(['/dpp-tapp/ecnec-meeting', row.uuid]);
    }


    // For searching from list
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    // For calling list during page change
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getEcnecMeeting();
    }


    // For getting all agency list
    getEcnecMeeting() {
        this.subscribe$.add(
            this.ecnecMeetingService.getAllEcnecMeeting(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.meetingStatus ? 'অপেক্ষমাণ' : 'অনুষ্ঠিত'})));
                this.total = res.totalElements;
            })
        );
    }

    private loadData() {
        this.subscribe$.add(
            this.agencyDashboardService.getAgencyDashboardData().subscribe(res => {
                this.agencyDashboardModel = res;
                this.initTotalProjectChart();
                this.showFsChart();
                this.showRecommendedStatusChart();
                this.initOngoingChart()
            })
        );
    }


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

    private showFsChart() {
        this.chartOptionsFs = {
            seriesNonAxis: [this.agencyDashboardModel?.fsComplete, this.agencyDashboardModel?.fsNotComplete],
            chart: {
                type: "pie",
                width: 400,
                height: 280
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

    openDialog(meetingId, meetingName) {
        this.meetingName = meetingName;
        this.getProjectListByMeetingId(meetingId);
        const dialogRef = this.dialog.open(this.callAPIDialog, {
            height: 'auto',
            width: '1100px',
            position: {
                top: '10vh',
                left: '12vw'
            },
        });
        dialogRef.afterClosed().subscribe(res => {
        });
    }

    closeDialog() {
        this.dialog.closeAll();
        this.projectListDataSource = new MatTableDataSource();
    }

    getProjectListByMeetingId(meetingId: number){
        this.spinner = true;
        this.assignMeetingService.getProjectListByMeetingId(meetingId).subscribe(res =>{
            this.projectListDataSource = new MatTableDataSource(res);
            this.meetingId = meetingId;
            this.spinner = false;
        }, error => this.spinner = false);
    }



    goToAwaitingList() {
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.awaitingDatasource;
        this.commonTotalElement = this.awaitingElement;
    }

    goToConditionalApproveList() {
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.conditionalDataSource;
        this.commonTotalElement = this.conditionalElement;
    }

    gotoeAwaitingSectorDivision1(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.awaitingDatasource1;
        this.commonTotalElement = this.awaitingElement1;
    }

    gotoConditionalSectorDivision1(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.conditionalDataSource1;
        this.commonTotalElement = this.conditionalElement1;
    }

    gotoeAwaitingSectorDivision2(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.awaitingDatasource2;
        this.commonTotalElement = this.awaitingElement2;
    }

    gotoConditionalSectorDivision2(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.conditionalDataSource2;
        this.commonTotalElement = this.conditionalElement2;
    }

    gotoeAwaitingSectorDivision3(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.awaitingDatasource3;
        this.commonTotalElement = this.awaitingElement3;
    }

    gotoConditionalSectorDivision3(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.conditionalDataSource3;
        this.commonTotalElement = this.conditionalElement3;
    }

    gotoeAwaitingSectorDivision4(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.awaitingDatasource4;
        this.commonTotalElement = this.awaitingElement4;
    }

    gotoConditionalSectorDivision4(){
        this.sectorListPage = true;
        this.ecnecDashbord = false;
        this.commonDatasource = this.conditionalDataSource4;
        this.commonTotalElement = this.conditionalElement4;
    }

    backToDashbord() {
        this.ecnecDashbord = true;
        this.sectorListPage = false;
    }

    navigateToMap() {
        this.route.navigate([`gis-map-dashboard`]);
    }
}
