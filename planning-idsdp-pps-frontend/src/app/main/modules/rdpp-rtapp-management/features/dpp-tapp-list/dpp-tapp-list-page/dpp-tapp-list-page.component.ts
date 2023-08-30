import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ProjectMovementModel} from '../../../../configuration-management/models/project-movement.model';
import {ProjectType} from '../../../../configuration-management/models/project-type.model';
import {SectorDivisionModel} from '../../../../configuration-management/models/sector-division.model';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../../core/constants/constant';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {ProjectMovementService} from '../../../../configuration-management/services/project-movement.service';
import {ProjectTypeService} from '../../../../configuration-management/services/project-type.service';
import {ProjectSummaryService} from '../../../../project-concept-management/services/project-summary.service';
import {SectorDivisionService} from '../../../../configuration-management/services/sector-division.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {IProjectConcept} from '../../../../project-concept-management/models/project-concept';
import {DatePipe} from '@angular/common';
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../models/dppObjectiveCost.model";
import {FuseNavigationService} from "../../../../../../../@fuse/components/navigation";
import {TranslateService} from "@ngx-translate/core";
import {LayoutHelperService} from "../../../../../../layout/layouts/vertical/services/layout-helper.service";

// import {locale as lngEnglishNav} from '../../../../../../../app/layout/layouts/vertical/classy/i18n/en';
// import {locale as lngBanglaNav} from '../../../../../../../app/layout/layouts/vertical/classy/i18n/bn';
import {TappObjectiveCostService} from "../../../services/tapp-objective-cost.service";
import {TappObjectiveCostModel} from "../../../models/tappObjectiveCost.model";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {ApprovalStatusService} from "../../../../configuration-management/services/approvalStatusService.service";
import {ApprovalStatus} from "../../../../configuration-management/models/approvalStatus.model";
import {ProjectMovementService as StageMovementService} from "../../../services/project-movement.service";
import {map, switchMap} from "rxjs/operators";
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';
import { ReportDataService } from 'app/main/shared/services/report-data.service';
import { environment } from 'environments/environment';

import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { AssingEcnecMeetingService } from '../../../services/assign-ecnec-meeting.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { AssignEcnecMeetingModel } from '../../../models/assign-ecnec-meeting.model';
import { ERROR, FAILED_SAVE, OK, SUCCESSFULLY_SAVE } from 'app/main/core/constants/message';
import { EcnecMeetingModel } from '../../../models/ecnec-meeting.model';
import { EcnecMeetingService } from '../../../services/ecnec-meeting.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { SendToDakEnothiComponent } from 'app/main/shared/components/send-to-dak-enothi/send-to-dak-enothi.component';

@Component({
    selector: 'app-dpp-tapp-list-page',
    templateUrl: './dpp-tapp-list-page.component.html',
    styleUrls: ['./dpp-tapp-list-page.component.scss']
})
export class DppTappListPageComponent extends UnsubscribeAdapterComponent implements OnInit {

    displayedColumns: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];

    displayedColumnsEcnec: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other', 'action'];
    displayedColumns2Ecnec: string[] = ['thSl', 'thProjectName', 'thProjectCost', 'opt'];

    dataSource: MatTableDataSource<any>;
    ecnecDataSource: MatTableDataSource<IProjectConcept>;

    form: any;
    projectMovementList: Array<ProjectMovementModel>;
    colors: string[] = ['#035d92', '#646c7a', '#009254', '#c58200', '#e26800', '#047984', '#4b778d'];
    colorList: string[] = [];
    projectTypeList: Array<ProjectType>;
    sectorDivisionList: Array<SectorDivisionModel>;
    approvalStatusList: Array<ApprovalStatus>;
    approvalStatusColorList: string[] = [];
    dppObjectiveAndCostList: DppObjectiveCostModel[] = [];
    tappObjectiveAndCostList: TappObjectiveCostModel[] = [];
    sectorList: Array<SectorModel>;

    actionPermission = [];
    selectedLanguage: any;
    navigation;

    searchText = "";
    ecnecListTotal: number;
    _changeInterval = null;

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;

    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    createNewDpp: boolean;
    createEcnecMeeting: boolean;
    showHideEcnecMeeting: boolean;
    sendToNothi: boolean;
    isEcnecReportDownload: boolean = false;
    ecnecReportUrlPath = null;
    navigationPage = environment.ibcs.navigateToUui;
    showEcnecList: boolean;
    spinner: boolean;

    showAssignMeeting: boolean = false;
    assingMeeting: boolean = false;
    assignMeetingButton: boolean = true;
    meeting : any;

    assignEcnecMeetingModel: AssignEcnecMeetingModel = new AssignEcnecMeetingModel();
    ecnecMeetingModel: EcnecMeetingModel[] = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private projectMovementService: ProjectMovementService,
        private projectTypeService: ProjectTypeService,
        private dppObjectiveCostService: DppObjectiveCostService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private projectSummaryService: ProjectSummaryService,
        private sectorDivisionService: SectorDivisionService,
        private sectorService: SectorService,
        private approvalStatusService: ApprovalStatusService,
        private router: Router,
        private route: ActivatedRoute,
        private stageMovementService: StageMovementService,
        private datePipe: DatePipe,
        private _fuseNavigationService: FuseNavigationService,
        private _translateService: TranslateService,
        private layoutHelperService: LayoutHelperService,
        private  userGroupService: UserGroupService,
        private reportDataService : ReportDataService,
        private assignMeetingService : AssingEcnecMeetingService,
        private snackbarHelper : SnackbarHelper,
        private ecnecMeetingService: EcnecMeetingService,
        private dialog: MatDialog,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.selectedLanguage = _fuseTranslationLoaderService.getActiveLang();
    }

    ngOnInit(): void {
        this.getAllApi();
        this.getActiveEcnecMeetingList();

        this.getUserGroup();
        this.populateForm();
        // this.getProjectMovementList();
        // this.getProjectTypeList();
        // this.getApprovalStatusList();
        this.actionPermission = lngEnglish.data.ACTION;
        this.layoutHelperService.changeNavLanguage('en');
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroup = res.res;
            if(this.userGroup.groupStatus ==='AGENCY-DESK'){
                this.createNewDpp = true;
            }
            if (this.userGroup.groupStatus === 'ECNEC-DESK') {
                this.showHideEcnecMeeting = true;
                this.createEcnecMeeting = true;
                this.sendToNothi = true;
            }
            if(this.userGroup.groupStatus === 'ECNEC-HEAD' || this.userGroup.groupStatus === 'ECNEC-DESK' || this.userGroup.groupStatus === 'ECNEC-OFFICER'){
                // this.createEcnecMeeting = true;
                // this.showHideEcnecMeeting = true;
                // this.sendToNothi = true;
                this.layoutHelperService.changeNavLanguage('bn');
                this.getEcnecEnothiReport();
            }
        });
    }

    private getAllApi() {
        this.subscribe$.add(
            this.sectorService.getActiveSector().pipe(
                switchMap(sector => this.sectorDivisionService.getActiveSectorDivision().pipe(
                    switchMap(sectorDivision => this.dppObjectiveCostService.getObjectiveCostList().pipe(
                        switchMap(dppObjectiveCost => this.tappObjectiveCostService.getTappObjectiveCostList().pipe(
                            map(tappObjectiveCost => ({
                                sector: sector,
                                sectorDivision: sectorDivision,
                                dppObjectiveCost: dppObjectiveCost,
                                tappObjectiveCost: tappObjectiveCost
                            }))
                        ))
                    ))
                ))
            ).subscribe(res => {
                this.sectorList = res.sector;
                this.sectorDivisionList = res.sectorDivision;
                this.dppObjectiveAndCostList = res.dppObjectiveCost;
                this.tappObjectiveAndCostList = res.tappObjectiveCost;
                this.searchByCriteria();
            })
        )
    }


    /*applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }*/

    /*onChangePage(event: PageEvent) {
        if(this.projectType == "DPP") {
            this.size = +event.pageSize; // get the pageSize
            this.page = +event.pageIndex; // get the current page
            this.getRdppList();
        } else {
            this.size = +event.pageSize; // get the pageSize
            this.page = +event.pageIndex; // get the current page
            this.getRtappList();
        }
    }*/

    getRdppRtappList(data) {
        if(data == "RDPP") {
            this.getRdppList();
        } else if(data == "RTAPP") {
            this.getRtappList();
        }
    }

    private getProjectTypeList() {
        this.subscribe$.add(
            this.projectTypeService.getListWithPagination(this.page, MAX_PAGE_SIZE).subscribe(res => {
                this.projectTypeList = res.content;
            })
        );
    }

    // for get Sector List
    private getSectorList() {
        this.subscribe$.add(
            this.sectorService.getActiveSector().subscribe(res => {
                this.sectorList = res;
            })
        );
    }

    private getSectorDivisionList() {
        this.subscribe$.add(
            this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
                this.sectorDivisionList = res;
            })
        );
    }

    private populateForm(): void {
        this.form = new FormGroup({
            projectType: new FormControl('RDPP'),
            projectName: new FormControl(''),
            sector: new FormControl(''),
            lowAmount: new FormControl(''),
            highAmount: new FormControl(''),
            status: new FormControl('')
        });
    }

    getRdppList() {
        this.subscribe$.add(
            this.dppObjectiveCostService.getRdppRtappList(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                let ecnecDataList = this.arrangeEcnecListData(res.content.filter(f => f.status != 'ECNEC_CONDITIONAL_APPROVE'));
                this.ecnecDataSource = new MatTableDataSource(ecnecDataList);
                this.total = res.totalElements;
            })
        );
    }

    private arrangeData(res: IProjectConcept[]) {
        return res.map(m => ({
            ...m,
            sectorDivisionName: this.sectorDivisionList.filter(e => e?.id === m?.concernedDivisionId).map(m => m?.sectorDivisionNameEn),
            // titleEn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleEn(m, this.dppObjectiveAndCostList) : this.getTitleEn(m, this.tappObjectiveAndCostList),
            // titleBn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleBn(m, this.dppObjectiveAndCostList) : this.getTitleBn(m, this.tappObjectiveAndCostList),
            commencementDate: this.datePipe.transform(m?.dateCommencement, 'dd/MM/yyyy'),
            completionDate: this.datePipe.transform(m?.dateCompletion, 'dd/MM/yyyy'),
            movementStatus: m?.projectStatus.split('_').join(' '),
            paAmount: m?.grandTotal?.gobThruAmount + m?.grandTotal?.spAcAmount + m?.grandTotal?.thruDpAmount + m?.grandTotal?.thruPdAmount,
            rpaAmount: m?.grandTotal?.thruDpAmount + m?.grandTotal?.thruPdAmount
        }));
    }

    private arrangeEcnecListData(res: IProjectConcept[]) {
        return res.filter(f => (f.projectStatus != 'APPROVED_BY_ECNEC'))
            .map(m => ({
            ...m,
            // movementStatus: m.status ? m.status== 'ECNEC_OFFICERS' ? "ECNEC WINGS": m.status.split('_').join(' ') : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList.filter(e => e?.id === m?.concernedDivisionId).map(m => m?.sectorDivisionNameEn),
            commencementDate: this.datePipe.transform(m?.dateCommencement, 'dd/MM/yyyy'),
            completionDate: this.datePipe.transform(m?.dateCompletion, 'dd/MM/yyyy'),
            movementStatus: m?.projectStatus.split('_').join(' '),
            paAmount: m?.grandTotal?.gobThruAmount + m?.grandTotal?.spAcAmount + m?.grandTotal?.thruDpAmount + m?.grandTotal?.thruPdAmount,
            rpaAmount: m?.grandTotal?.thruDpAmount + m?.grandTotal?.thruPdAmount,
            assignMeetingButton: true,
            assingMeeting: false,
            showAssignMeeting: false,
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

    edit(row) {
        this.router.navigate([`rdpp-rtapp/dashboard/${row.uuid}`]);
    }

    viewDashboard(row) {
        this.router.navigate([`rdpp-rtapp/view-dashboard/${row.uuid}`]);
    }

    private getDppObjectiveCostList() {
        this.dppObjectiveCostService.getObjectiveCostList().subscribe(res => {
            this.dppObjectiveAndCostList = res;
        });
    }

    private getTappObjectiveCostList() {
        this.tappObjectiveCostService.getTappObjectiveCostList().subscribe(res => {
            this.tappObjectiveAndCostList = res;
        });
    }

    // Toggle navigation
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);
        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    // Set the language
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        this._translateService.use(lang);
        // Nav Language Change
        this.navLanguageSwitcher('en');
        this.layoutHelperService.setLanguageEvent(this.selectedLanguage);
    }

    private navLanguageSwitcher(selectedLanguage: string): void {
        if (selectedLanguage === 'en') {
            this.navigation = lngEnglish.data.NAV;
        } else if (selectedLanguage === 'bn') {
            this.navigation = lngBangla.data.NAV;
        }
    }

    gotToViewDashboard(row) {
        this.router.navigate(['/rdpp-rtapp/view-dashboard'], { queryParams: {pcUuid: row.projectConceptUuid, id: row.id}});
    }

    clearSearchForm() {
        this.form.reset();
        this.populateForm();
        this.searchByCriteria();
    }

    searchByCriteria() {
        this.spinner = true;
        this.searchText = "";
        if (this.paginator) {
            this.paginator.firstPage();
        }
        const projectName = this.form.value.projectName === '' ? null : this.form.value.projectName;
        this.commonSearchCriteria(projectName);
    }

    commonSearchCriteria(searchText) {
        const projectType = this.form.value.projectType === '' ? 'RDPP' : this.form.value.projectType;
        const projectName = searchText;
        const sector = this.form.value.sector === '' ? null : this.form.value.sector;
        const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
        const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
        const status = this.form.value.status === '' ? null : this.form.value.status;

        this.subscribe$.add(
            this.dppObjectiveCostService.searchRdppRtapp(projectType, projectName, sector, lowAmount, highAmount, status, this.page, this.size).subscribe(res => {
                res.content.forEach(data =>{
                    data.assignMeetingButton = true;
                    data.assingMeeting = false;
                    data.showAssignMeeting = false;
                })

                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                let ecnecDataList = this.arrangeEcnecListData(res.content.filter(f => f.status != 'ECNEC_CONDITIONAL_APPROVE'));
                this.ecnecDataSource = new MatTableDataSource(ecnecDataList);
                this.ecnecListTotal = this.arrangeEcnecListData(res.content).length;
                this.total = res.totalElements;
                this.spinner = false;

            }, error => this.spinner = false)
        );
    }

    applyFilter(event: Event): void {
        clearInterval(this._changeInterval)
        this._changeInterval = setInterval(()=> {
            this.searchText = (event.target as HTMLInputElement).value;
            this.form.patchValue({
                projectName: ""
            });

            if (this.paginator) {
                this.paginator.firstPage();
            }
            const projectType = this.form.value.projectType === '' ? 'RDPP' : this.form.value.projectType;
            const sector = this.form.value.sector === '' ? null : this.form.value.sector;
            const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
            const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
            const status = this.form.value.status === '' ? null : this.form.value.status;

            this.dppObjectiveCostService.searchRdppRtapp(projectType, this.searchText, sector, lowAmount, highAmount, status, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
            }, error => this.spinner = false)
            clearInterval(this._changeInterval)
        }, 500);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        const searchText = this.searchText === "" ? (this.form.value.projectName === '' ? null : this.form.value.projectName) : this.searchText;
        this.commonSearchCriteria(searchText);
    }

    downloadPdfView() {

    }

    getRtappList() : any {
        this.subscribe$.add(
            this.tappObjectiveCostService.getRtappList(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                let ecnecDataList = this.arrangeEcnecListData(res.content.filter(f => f.status != 'ECNEC_CONDITIONAL_APPROVE'));
                this.ecnecDataSource = new MatTableDataSource(ecnecDataList);
                this.total = res.totalElements;
            })
        );
    }

    getEcnecEnothiReport(){
        this.reportDataService.getEnothiEcnecReport().subscribe(res=>{
            if (res) {
                this.ecnecReportUrlPath = res.urlPath;
                this.isEcnecReportDownload = true;
            }
        })
    }

    showAssignProjectsMeetingList() {
        this.showEcnecList = !this.showEcnecList;
    }


    createAssignMeeting(data, pcUuid){

        this.assignMeetingService.createAssignMeeting(this.assignEcnecMeetingModel).subscribe(res =>{
            if (res.pcId) {
                this.findByPcUuid(data, pcUuid);
                data.assingMeeting= false;
                data.assignMeetingButton = false;
                data.showAssignMeeting = true;

                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_SAVE, ERROR);
            }
        })
    }


    findByPcUuid(data, pcUuid) {
        this.subscribe$.add(
            this.assignMeetingService.findByPcUuid(pcUuid).subscribe(res=>{
                if(res){
                    data.ecnecMeetingName = res.ecnecMeeting.meetingName;
                    data.showAssignMeeting = true;
                    data.visibility_off = false;
                    data.assignMeetingButton = false;
                }else{
                    data.assingMeeting = true;
                    data.assignMeetingButton = false;
                }
            })
        )

    }

    private openDialog(data, pcUuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteAssignMeeting(data, pcUuid);
            }
            dialogRef.close(true);
        });
    }

    deleteAssignMeeting(data, pcUuid){
        this.subscribe$.add(
            this.assignMeetingService.deleteAssignMeeting(pcUuid).subscribe((res) => {
                data.showAssignMeeting = false;
                data.assingMeeting = false;
                data.assignMeetingButton = true;
                this.findByPcUuid(data, pcUuid);
                this.snackbarHelper.openSuccessSnackBarWithMessage("Successfully Deleted Meeting", "Ok");
            })
        )
    }

    getActiveEcnecMeetingList(): any{
        this.ecnecMeetingService.getActiveEcnecMeetingList().subscribe(res =>{
            this.ecnecMeetingModel = res;
        })
    }

    onChangePaperType($event: MatSelectChange, data) {

        if($event.value != null || $event.value == ""){
            this.assignEcnecMeetingModel.pcId = data.id;
            this.assignEcnecMeetingModel.pcUuid = data.uuid;
            this.assignEcnecMeetingModel.ecnecMeetingId = $event.value;
        }

    }

    sendDppTappToNothi(){
        const source = 'DPP';
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            source: source,
            sourceId: null,
            pcUuid: null,
            reportType: 'en',
            srcUserGroup: 'ECNEC',
            projectType: this.form.value.projectType === '' ? null : this.form.value.projectType,
            sectorDivision : this.form.value.sectorDivision === '' ? null : this.form.value.sectorDivision,
            gob : this.form.value.fundingType === 'GoB',
            isForeignAi : this.form.value.fundingType === 'PA',
            isFsRequired : false,
            projectName : this.form.value.projectName === '' ? null : this.form.value.projectName,
            sector : this.form.value.sector === '' ? null : this.form.value.sector,
            lowAmount : this.form.value.lowAmount ? this.form.value.lowAmount : null,
            highAmount : this.form.value.highAmount ? this.form.value.highAmount : null,
            status : this.form.value.status === '' ? null : this.form.value.status,
        };
        const dialogRef = this.dialog.open(SendToDakEnothiComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }


}
