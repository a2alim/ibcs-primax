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
import {Router} from '@angular/router';
import * as bl2Js from 'bl2-js-report';
import {
    locale as lngEnglish
} from '../../../../dpp-tapp-management/features/dpp-tapp-list/dpp-tapp-list-page/i18n/en';
import {
    locale as lngBangla
} from '../../../../dpp-tapp-management/features/dpp-tapp-list/dpp-tapp-list-page/i18n/bn';
import {FormControl, FormGroup} from '@angular/forms';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {IProjectConcept} from '../../../../project-concept-management/models/project-concept';
import {DatePipe} from '@angular/common';
import {locale as lngEnglishAction} from "../../../../../../layout/layouts/vertical/classy/i18n/en";
import {DppObjectiveCostService} from "../../../services/dpp-objective-cost.service";
import {DppObjectiveCostModel} from "../../../models/dppObjectiveCost.model";
import {FuseNavigationService} from "../../../../../../../@fuse/components/navigation";
import {TranslateService} from "@ngx-translate/core";
import {LayoutHelperService} from "../../../../../../layout/layouts/vertical/services/layout-helper.service";

import {locale as lngEnglishNav} from '../../../../../../../app/layout/layouts/vertical/classy/i18n/en';
import {locale as lngBanglaNav} from '../../../../../../../app/layout/layouts/vertical/classy/i18n/bn';
import {TappObjectiveCostService} from "../../../services/tapp-objective-cost.service";
import {TappObjectiveCostModel} from "../../../models/tappObjectiveCost.model";
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {ApprovalStatusService} from "../../../../configuration-management/services/approvalStatusService.service";
import {ApprovalStatus} from "../../../../configuration-management/models/approvalStatus.model";
import {ProjectMovementService as StageMovementService} from "../../../services/project-movement.service";
import {CommentSourceEnum} from "../../../../project-concept-management/enums/comment-source.enum";
import {map, switchMap} from "rxjs/operators";
import {environment, reportBackend} from 'environments/environment';
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SendToDakEnothiComponent } from 'app/main/shared/components/send-to-dak-enothi/send-to-dak-enothi.component';
import {EcnecMeetingService} from "../../../services/ecnec-meeting.service";
import {EcnecMeetingModel} from "../../../models/ecnec-meeting.model";
import {AgencyService} from "../../../../configuration-management/services/agency.service";
import {IMinistryDivision} from "../../../../configuration-management/models/ministry-divisiont";
import {MatSelectChange} from "@angular/material/select";
import {AssignEcnecMeetingModel} from "../../../models/assign-ecnec-meeting.model";
import {AssingEcnecMeetingService} from "../../../services/assign-ecnec-meeting.service";
import {ERROR, FAILED_SAVE, OK, SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN} from "../../../../../core/constants/message";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {error} from "selenium-webdriver";
import {IPriorityModel} from "../../../../configuration-management/models/priority.model";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { FileUploadService } from 'app/main/core/services/file-upload.service';
import { ReportDataService } from 'app/main/shared/services/report-data.service';

@Component({
    selector: 'app-dpp-tapp-list-page',
    templateUrl: './dpp-tapp-list-page.component.html',
    styleUrls: ['./dpp-tapp-list-page.component.scss']
})
export class DppTappListPageComponent extends UnsubscribeAdapterComponent implements OnInit {

    displayedColumns: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other'];
    displayedColumnsEcnec: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other', 'action'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];
    displayedColumns2Ecnec: string[] = ['thSl', 'thProjectName', 'thProjectCost', 'opt'];

    dataSource: MatTableDataSource<IProjectConcept>;
    ecnecDataSource: MatTableDataSource<IProjectConcept>;

    assignMeetingForm: FormGroup;
    ecnecMeetingModel: EcnecMeetingModel[] = [];
    assignEcnecMeetingModel: AssignEcnecMeetingModel = new AssignEcnecMeetingModel();

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
    ecnectMeetingList: EcnecMeetingModel[] = [];

    actionPermission = [];
    selectedLanguage: any;
    navigation;
    navigationPage = environment.ibcs.navigateToUui;
    total: number;
    ecnecListTotal: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    spinner: boolean;
    showEcnecList: boolean;
    _changeInterval = null;
    searchText = "";


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    userGroup: {
        'groupStatus': null,
        'userId': null
    };
    private userStatus: boolean;
    private ecnecMeetingName: string;
    showAssignMeeting: boolean = false;
    assingMeeting: boolean = false;
    assignMeetingButton: boolean = true;
    meeting : any;
    createNewDpp: boolean;
    createEcnecMeeting: boolean;
    showHideEcnecMeeting: boolean;
    sendToNothi: boolean;
    ecnecReportUrlPath=null;
    isEcnecReportDownload: boolean = false;
    data: any = {};
    row: any = {};
    projectSummary: IProjectConcept;
    projectSummaryList: any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectMovementService: ProjectMovementService,
                private projectTypeService: ProjectTypeService,
                private dppObjectiveCostService: DppObjectiveCostService,
                private tappObjectiveCostService: TappObjectiveCostService,
                private projectSummaryService: ProjectSummaryService,
                private sectorDivisionService: SectorDivisionService,
                private sectorService: SectorService,
                private approvalStatusService: ApprovalStatusService,
                private router: Router,
                private stageMovementService: StageMovementService,
                private datePipe: DatePipe,
                private _fuseNavigationService: FuseNavigationService,
                private _translateService: TranslateService,
                private layoutHelperService: LayoutHelperService,
                private  userGroupService: UserGroupService,
                private dialog: MatDialog,
                private ecnecMeetingService: EcnecMeetingService,
                private assignMeetingService : AssingEcnecMeetingService,
                private snackbarHelper : SnackbarHelper,
                private fileUploadService : FileUploadService,
                private reportDataService : ReportDataService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.selectedLanguage = _fuseTranslationLoaderService.getActiveLang();
    }

    ngOnInit(): void {
        this.populateForm();
        // this.getProjectMovementList();
        // this.getProjectTypeList();
        // this.getApprovalStatusList();
        this.getAllApi();
        this.getUserGroup();
        this.getActiveEcnecMeetingList();
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.layoutHelperService.changeNavLanguage('en');
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
                this.ecnectMeetingList = res.ecnecMeetingList;
                this.searchByCriteria();
            }, error => this.spinner = false)
        )
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
            const projectType = this.form.value.projectType === '' ? null : this.form.value.projectType;
            const sectorDivision = this.form.value.sectorDivision === '' ? null : this.form.value.sectorDivision;
            const gob = this.form.value.fundingType === 'GoB';
            const isForeignAi = this.form.value.fundingType === 'PA';
            const isFsRequired = false;
            // const projectName = this.form.value.projectName === '' ? null : this.form.value.projectName;
            const sector = this.form.value.sector === '' ? null : this.form.value.sector;
            const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
            const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
            const status = this.form.value.status === '' ? null : this.form.value.status;

            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, this.searchText, sector, lowAmount, highAmount, status, CommentSourceEnum.DPP, this.page, this.size).subscribe(res => {
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

    // private getProjectMovementList() {
    //     this.subscribe$.add(
    //         this.projectMovementService.getAllProjectMovementByOrderIdAndModule(2).subscribe(res => {
    //             this.projectMovementList = res;
    //             for (let i = 0, c = 0; i < this.projectMovementList.length; i++, c++) {
    //                 this.colorList.push(this.colors[c]);
    //                 if (c >= this.colors.length - 1) {
    //                     c = 0;
    //                 }
    //             }
    //         })
    //     );
    // }

    // for get approval status List
    // private getApprovalStatusList() {
    //     this.subscribe$.add(
    //         this.approvalStatusService.fetchActiveApprovalStatusList().subscribe(res => {
    //             this.approvalStatusList = res;
    //             for (let i = 0, c = 0; i < res.length; i++, c++) {
    //                 this.approvalStatusColorList.push(this.colors[c]);
    //                 if (c >= this.colors.length - 1) {
    //                     c = 0;
    //                 }
    //             }
    //         })
    //     );
    // }

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

    private populateAssignMeetingForm():void{
        this.assignMeetingForm = new FormGroup({
            pcId : new FormControl('',),
            pcUuid : new FormControl(''),
            ecnecMeetingId : new FormControl('')
        })
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
        const projectType = this.form.value.projectType === '' ? null : this.form.value.projectType;
        const sectorDivision = this.form.value.sectorDivision === '' ? null : this.form.value.sectorDivision;
        const gob = this.form.value.fundingType === 'GoB';
        const isForeignAi = this.form.value.fundingType === 'PA';
        const isFsRequired = false;
        const projectName = searchText;
        const sector = this.form.value.sector === '' ? null : this.form.value.sector;
        const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
        const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
        const status = this.form.value.status === '' ? null : this.form.value.status;

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.DPP, this.page, this.size).subscribe(res => {
                res.content.forEach(data =>{
                    data.assignMeetingButton = true;
                    data.assingMeeting = false;
                    data.showAssignMeeting = false;
                })

                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.ecnecDataSource = new MatTableDataSource(this.arrangeEcnecListData(res.content.filter(f => f.status != 'ECNEC_CONDITIONAL_APPROVE')));
                this.ecnecListTotal = this.arrangeEcnecListData(res.content).length;
                this.total = res.totalElements;
                this.spinner = false;

            }, error => this.spinner = false)
        );
    }


    downloadPdfView() {
        const projectType = null;
        const sectorDivision = null;
        const gob = false;
        const isForeignAi = false;
        const isFsRequired = false;
        const projectName = null;
        const sector = null;
        const lowAmount = null;
        const highAmount = null;
        const status = null;

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.DPP ).subscribe(res => {
                res.content.forEach(data =>{
                    data.assignMeetingButton = true;
                    data.assingMeeting = false;
                    data.showAssignMeeting = false;
                })
                this.arrangeData(res.content)
                this.downloadPdf('downloadList');

            }, error => this.spinner = false)
        );
    }

    downloadPdf($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/dpp/downloadList';
        this.data['projectSummaryList'] = JSON.stringify(this.projectSummaryList);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    private arrangeData(res: IProjectConcept[]) {
        this.projectSummaryList = res.map(m => ({
            ...m,
            movementStatus: m.status ? m.status== 'ECNEC_OFFICERS' ? "ECNEC WINGS": m?.status.split('_').join(' ') : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList.filter(e => e.id === m.sectorDivisionId).map(m => m.sectorDivisionNameEn),
            titleEn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleEn(m, this.dppObjectiveAndCostList) : this.getTitleEn(m, this.tappObjectiveAndCostList),
            titleBn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleBn(m, this.dppObjectiveAndCostList) : this.getTitleBn(m, this.tappObjectiveAndCostList),
            commencementDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCommencementDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCommencementDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy'),
            completionDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCompletionDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCompletionDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy')
        }));
        return this.projectSummaryList;
    }


    private arrangeEcnecListData(res: IProjectConcept[]) {
        return res.filter(f => (f.status != 'APPROVED_BY_ECNEC'))
            .map(m => ({
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

    edit(row) {
        this.router.navigate([`dpp-tapp/dashboard/${row.uuid}`]);
    }

    viewDashboard(row) {
        this.router.navigate([`dpp-tapp/view-dashboard/${row.uuid}`]);
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
            this.navigation = lngEnglishNav.data.NAV;
        } else if (selectedLanguage === 'bn') {
            this.navigation = lngBanglaNav.data.NAV;
        }
    }

    gotToViewDashboard(row) {
        if (this.actionPermission?.includes('View Dpp Tapp Dashboard')) {
            this.router.navigate([`dpp-tapp/view-dashboard/${row.uuid}`]);
        }
    }

    // gotToDashboard(row) {
    //     if (row.projectTypeDTO.nameEn.toLowerCase() === 'dpp') {
    //         this.dppObjectiveCostService.getObjectiveCostByPcUuid(row.uuid).subscribe(res => {
    //             if (res) {
    //                 this.getDppCurrentStage(res.dppMasterId, row.uuid)
    //             } else {
    //                 this.router.navigate([`dpp-tapp/dashboard/${row.uuid}`]);
    //             }
    //         });
    //     } else if (row.projectTypeDTO.nameEn.toLowerCase() === 'tapp') {
    //         this.tappObjectiveCostService.getTappObjectiveCostByPcUuid(row.uuid).subscribe(res => {
    //             if (res) {
    //                 this.getTappCurrentStage(res.tappMasterId, row.uuid)
    //             } else {
    //                 this.router.navigate([`dpp-tapp/dashboard/${row.uuid}`]);
    //             }
    //         });
    //     }
    // }
    //
    // getDppCurrentStage(dppMasterId, uuid) {
    //     this.stageMovementService.getCurrentStage(dppMasterId).subscribe(async res => {
    //         if (res.res) {
    //             if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
    //                 await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
    //             } else {
    //                 await this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
    //             }
    //         } else {
    //             await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
    //         }
    //     });
    // }
    //
    // getTappCurrentStage(tappMasterId, uuid) {
    //     this.stageMovementService.getCurrentStageInTapp(tappMasterId).subscribe(async res => {
    //         if (res.res) {
    //             if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
    //                 await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
    //             } else {
    //                 await this.router.navigate([`dpp-tapp/view-dashboard/${uuid}`]);
    //             }
    //         } else {
    //             await this.router.navigate([`dpp-tapp/dashboard/${uuid}`]);
    //         }
    //     });
    // }
    clearSearchForm() {
        this.form.reset();
        this.populateForm();
        this.searchText = "";
        this.getAllApi();
    }

    applySearch(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    showAssignProjectsMeetingList() {
        this.showEcnecList = !this.showEcnecList;
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

    createAssignMeeting(data, pcUuid){

        this.assignMeetingService.createAssignMeeting(this.assignEcnecMeetingModel).subscribe(res =>{
            if (res.pcId) {
                this.findByPcUuid(data, pcUuid);
                data.assingMeeting= false;
                data.assignMeetingButton = false;
                data.showAssignMeeting = true;

                this.snackbarHelper.openSuccessSnackBarWithMessageEnBn(SUCCESSFULLY_SAVE, SUCCESSFULLY_SAVE_BN);
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

    getEcnecConditions(){
        this.ecnecMeetingService.getEnothiEcnecReport().subscribe(res=>{
        })
    }

    getEcnecEnothiReport(){
       this.reportDataService.getEnothiEcnecReport().subscribe(res=>{
           if (res) {
               this.ecnecReportUrlPath = res.urlPath;
               this.isEcnecReportDownload = true;
           }
       })
    }

    downloadProjectsMeetingList(){
        this.fileUploadService.downloadAttachmentFromReport(this.ecnecReportUrlPath);
    }

    gotoMisReport(){
        this.router.navigate(['/mis-report'])
    }



}
