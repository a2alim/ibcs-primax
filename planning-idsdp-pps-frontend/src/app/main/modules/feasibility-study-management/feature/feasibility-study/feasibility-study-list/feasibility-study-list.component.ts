import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ProjectMovementModel } from '../../../../configuration-management/models/project-movement.model';
import { ProjectType } from '../../../../configuration-management/models/project-type.model';
import { SectorDivisionModel } from '../../../../configuration-management/models/sector-division.model';
import * as bl2Js from 'bl2-js-report';
import {
    DEFAULT_PAGE,
    DEFAULT_SIZE,
    MAX_PAGE_SIZE,
} from '../../../../../core/constants/constant';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectMovementService } from '../../../../configuration-management/services/project-movement.service';
import { ProjectTypeService } from '../../../../configuration-management/services/project-type.service';
import { ProjectSummaryService } from '../../../../project-concept-management/services/project-summary.service';
import { SectorDivisionService } from '../../../../configuration-management/services/sector-division.service';
import { UnsubscribeAdapterComponent } from '../../../../../core/helper/unsubscribeAdapter';
import { IProjectConcept } from '../../../../project-concept-management/models/project-concept';
import { FeasibilityProposalHelperService } from '../../../services/feasibility-proposal-helper.service';
import { ApprovalStatusService } from '../../../../configuration-management/services/approvalStatusService.service';
import { ApprovalStatus } from '../../../../configuration-management/models/approvalStatus.model';
import { FeasibilityStudyProposalSummaryService } from '../../../services/feasibility-study-proposal-summary.service';
import { FeasibilityStudySummaryService } from '../../../services/feasibility-study-summary.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from '../../../../../shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from '../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {
    locale as lngEnglishNav,
    locale as lngEnglishAction,
} from '../../../../../../layout/layouts/vertical/classy/i18n/en';
import { locale as lngBanglaNav } from '../../../../../../layout/layouts/vertical/classy/i18n/bn';
import { FuseNavigationService } from '../../../../../../../@fuse/components/navigation';
import { TranslateService } from '@ngx-translate/core';
import { LayoutHelperService } from '../../../../../../layout/layouts/vertical/services/layout-helper.service';
import { ReportDataService } from '../../../../../shared/services/report-data.service';
import { ReportCommonService } from '../../../../../core/services/report-common.service';
import { SnackbarHelper } from '../../../../../core/helper/snackbar.helper';
import { SectorModel } from '../../../../configuration-management/models/sector.model';
import { SectorService } from '../../../../configuration-management/services/sector.service';
import { DatePipe } from '@angular/common';
import { CommentSourceEnum } from '../../../../project-concept-management/enums/comment-source.enum';
import { map, switchMap } from 'rxjs/operators';
import { environment, reportBackend } from 'environments/environment';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';

@Component({
    selector: 'app-feasibility-study-list',
    templateUrl: './feasibility-study-list.component.html',
    styleUrls: ['./feasibility-study-list.component.scss'],
})
export class FeasibilityStudyListComponent
    extends UnsubscribeAdapterComponent
    implements OnInit
{
    displayedColumns: string[] = [
        'sl',
        'projectName',
        'total',
        'gob',
        'pa',
        'ownFund',
        'other',
    ];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];

    dataSource: MatTableDataSource<IProjectConcept>;

    isFeasibilityProposalCreated: boolean[] = [];

    isFeasibilityReportCreated: boolean[] = [];

    form: any;
    projectMovementList: Array<ProjectMovementModel>;
    colors: string[] = [
        '#035d92',
        '#646c7a',
        '#009254',
        '#c58200',
        '#e26800',
        '#047984',
        '#4b778d',
    ];
    colorList: string[] = [];
    approvalStatusColorList: string[] = [];
    projectTypeList: Array<ProjectType>;
    // approvalStatusList: Array<ApprovalStatus>;
    sectorDivisionList: Array<SectorDivisionModel>;
    sectorList: Array<SectorModel>;

    fsProject: any;

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];
    selectedLanguage: any;
    navigation;
    navigationPage = environment.ibcs.navigateToUui;
    _changeInterval = null;
    searchText = "";

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    @ViewChild('callCreateFsDialog') callCreateFsDialog: TemplateRef<any>;

    userGroup: any = {};
    data: any = {};
    projectSummaryList: any[] = [];
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private projectMovementService: ProjectMovementService,
        private projectTypeService: ProjectTypeService,
        private approvalStatusService: ApprovalStatusService,
        private projectSummaryService: ProjectSummaryService,
        private _reportDataService: ReportDataService,
        private _reportCommonService: ReportCommonService,
        private snackbarHelper: SnackbarHelper,
        private feasibilityStudyProposalSummaryService: FeasibilityStudyProposalSummaryService,
        private feasibilityStudySummaryService: FeasibilityStudySummaryService,
        private dialog: MatDialog,
        private feasibilityProposalHelperService: FeasibilityProposalHelperService,
        private sectorDivisionService: SectorDivisionService,
        private datePipe: DatePipe,
        private sectorService: SectorService,
        private router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private _translateService: TranslateService,
        private layoutHelperService: LayoutHelperService,
        private userGroupService: UserGroupService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this._translateService.use('en');
        this.populateForm();
        // this.getProjectMovementList();
        //  this.getProjectTypeList();
        // this.getApprovalStatusList();
        this.getAllApi();
        this.getUserGroup();
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.layoutHelperService.changeNavLanguage('en');
    }

    private getAllApi() {
        this.subscribe$.add(
            this.sectorService
                .getActiveSector()
                .pipe(
                    switchMap((sector) =>
                        this.sectorDivisionService
                            .getActiveSectorDivision()
                            .pipe(
                                map((sectorDivision) => ({
                                    sector: sector,
                                    sectorDivision: sectorDivision,
                                }))
                            )
                    )
                )
                .subscribe((res) => {
                    this.sectorList = res.sector;
                    this.sectorDivisionList = res.sectorDivision;
                    this.searchByCriteria();
                })
        );
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     this.dataSource.filter = filterValue.trim().toLowerCase();
    //     if (this.dataSource.paginator) {
    //         this.dataSource.paginator.firstPage();
    //     }
    // }

    // for searching

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
            const isFsRequired = true;
            const sector = this.form.value.sector === '' ? null : this.form.value.sector;
            const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
            const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
            const status = this.form.value.status === '' ? null : this.form.value.status;

            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, this.searchText, sector, lowAmount, highAmount, status, CommentSourceEnum.FS_PROPOSAL, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
            })
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
    //         this.projectMovementService.getAllProjectMovementByOrderIdAndModule(3).subscribe(res => {
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

    // for get Sector List
    private getSectorList() {
        this.subscribe$.add(
            this.sectorService.getActiveSector().subscribe((res) => {
                this.sectorList = res;
            })
        );
    }

    private getProjectTypeList() {
        this.subscribe$.add(
            this.projectTypeService
                .getListWithPagination(this.page, MAX_PAGE_SIZE)
                .subscribe((res) => {
                    this.projectTypeList = res.content;
                })
        );
    }

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

    // for get SectorDivision List
    private getSectorDivisionList() {
        this.subscribe$.add(
            this.sectorDivisionService
                .getActiveSectorDivision()
                .subscribe((res) => {
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

    searchByCriteria() {
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
        const isFsRequired = true;
        const projectName = searchText;
        const sector = this.form.value.sector === '' ? null : this.form.value.sector;
        const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
        const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
        const status = this.form.value.status === '' ? null : this.form.value.status;

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision, gob, isForeignAi, isFsRequired, projectName,
                sector, lowAmount, highAmount, status, CommentSourceEnum.FS_PROPOSAL, this.page, this.size).subscribe((res) => {

                res.content.forEach((m) => {
                    this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(m.uuid).subscribe((res) => {
                        if (res) {
                            this.isFeasibilityProposalCreated[m.id] = true;
                        } else {
                            this.isFeasibilityProposalCreated[m.id] = false;
                        }
                    });
                    this.feasibilityStudySummaryService.getFsSummaryByPcUuid(m.uuid).subscribe((res) => {
                        if (res) {
                            this.isFeasibilityReportCreated[m.id] = true;
                        } else {
                            this.isFeasibilityReportCreated[m.id] = false;
                        }
                    });
                });
                this.dataSource = new MatTableDataSource(
                    this.arrangeData(res.content)
                );
                this.total = res.totalElements;
            })
        );
    }

    downloadPdfView() {
        const projectType = null;
        const sectorDivision = null;
        const gob = false;
        const isForeignAi = false;
        const isFsRequired = true;
        const projectName = null;
        const sector = null;
        const lowAmount = null;
        const highAmount = null;
        const status = null;

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision, gob, isForeignAi, isFsRequired, projectName,
                sector, lowAmount, highAmount, status, CommentSourceEnum.FS_PROPOSAL).subscribe((res) => {

                res.content.forEach((m) => {
                    this.feasibilityStudyProposalSummaryService.getFspSummaryByPcUuid(m.uuid).subscribe((res) => {
                        if (res) {
                            this.isFeasibilityProposalCreated[m.id] = true;
                        } else {
                            this.isFeasibilityProposalCreated[m.id] = false;
                        }
                    });
                    this.feasibilityStudySummaryService.getFsSummaryByPcUuid(m.uuid).subscribe((res) => {
                        if (res) {
                            this.isFeasibilityReportCreated[m.id] = true;
                        } else {
                            this.isFeasibilityReportCreated[m.id] = false;
                        }
                    });
                });

                this.arrangeData(res.content);
                this.downloadPdf('fisibilityStudy');
            })
        );
    }

    downloadPdf($fileName = '') {
        this.data['fileName'] = $fileName;
        // this.data['templateName'] = 'pps-reports/' + $templateName;

        this.data['templateName'] = 'pps-reports/dpp/fisibilityStudy';
        // this.data['lng'] = localStorage.getItem("currentLang");



        this.data['projectSummaryList'] = JSON.stringify(this.projectSummaryList);

        console.log('Daaaaaataaaaaaa:---',this.projectSummaryList)

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';

        form.action = `${reportBackend}/pdf-generate-post`
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);

        // var params = this.data;
        // for (const key in params) {
        //     if (params.hasOwnProperty(key)) {
        //         const hiddenField = document.createElement('input');
        //         hiddenField.type = 'hidden';
        //         hiddenField.name = key;
        //         hiddenField.value = params[key];
        //         form.appendChild(hiddenField);
        //     }
        // }
        // document.body.appendChild(form);
        // form.submit();
    }
    // private arrangeData(res: IProjectConcept[]) {
    //     return res.map((m) => ({
    //         ...m,
    //         movementStatus: m.status
    //             ? m.status.split('_').join(' ')
    //             : 'AGENCY DESK',
    //         sectorDivisionName: this.sectorDivisionList
    //             .filter((e) => e.id === m.sectorDivisionId)
    //             .map((m) => m.sectorDivisionNameEn),
    //         commencementDate: this.datePipe.transform(
    //             m.expCommencementDate,
    //             'dd/MM/yyyy'
    //         ),
    //         completionDate: this.datePipe.transform(
    //             m.expCompletionDate,
    //             'dd/MM/yyyy'
    //         ),
    //     }));
    // }
    private arrangeData(res: IProjectConcept[]) {
        this.projectSummaryList =   res.map((m) => ({
            ...m,
            movementStatus: m.status
                ? m.status.split('_').join(' ')
                : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList
                .filter((e) => e.id === m.sectorDivisionId)
                .map((m) => m.sectorDivisionNameEn),
            commencementDate: this.datePipe.transform(
                m.expCommencementDate,
                'dd/MM/yyyy'
            ),
            completionDate: this.datePipe.transform(
                m.expCompletionDate,
                'dd/MM/yyyy'
            ),
        }));
        return this.projectSummaryList;
    }




    // edit(row) {
    //     this.router.navigate([`feasibility-study/add-feasibility-study-report/${row.uuid}`]);
    // }

    projectConcept(row) {
        this.router.navigate([
            `feasibility-study/add-feasibility-study-report/${row.uuid}`,
        ]);
        this.closeReportDownloadDialog();
    }

    projectConceptForProposal(row) {
        this.closeReportDownloadDialog();
        if (this.isFeasibilityProposalCreated[row.id]) {
            this.router.navigate([
                `feasibility-study/edit-dashboard/${row.uuid}`,
            ]);
        } else {
            this.router.navigate([
                `feasibility-study/add-feasibility-study-proposal/${row.uuid}`,
            ]);
        }
    }

    // editFsProposal(row) {
    //     this.router.navigate([`feasibility-study/add-feasibility-study-proposal/${row.uuid}`]);
    // }
    viewDashboard(row) {
        this.closeReportDownloadDialog();
        this.router.navigate([`feasibility-study/view-dashboard/${row.uuid}`]);
    }

    downloadFSReport(row) {
        this._reportDataService.getFSReport(row.uuid).subscribe(
            (res) => {
                this._reportCommonService.previewReport(res, 'PDF');
            },
            (err) => {
                this.snackbarHelper.openWarnSnackBarWithMessage(
                    'Report Not Found !',
                    'OK'
                );
            }
        );
    }

    /**
     * For mat dialog
     * @param row
     */
    openDialog(row: IProjectConcept) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.FSREPORT };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.projectConcept(row);
                dialogRef.close(true);
                this.dialog.closeAll();
            } else {
                dialogRef.close(true);
            }
            this.closeReportDownloadDialog();
        });
    }

    /**
     * For mat dialog
     * @param row
     */
    openDialogFsProposal(row: IProjectConcept) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.FSPROPOSAL };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            this.closeReportDownloadDialog();
            if (res) {
                this.projectConceptForProposal(row);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }
        });
    }

    /**
     * For mat dialog
     * @param row
     */
    openDialogFsReport(row: IProjectConcept) {
        if (!this.isFeasibilityReportCreated[this.fsProject?.id]) {
            return this.snackbarHelper.openWarnSnackBarWithMessage(
                'You are not allowed !',
                'OK'
            );
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.FSREPORTVIEW };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            this.closeReportDownloadDialog();
            if (res) {
                this.downloadFSReport(row);
                dialogRef.close(true);
            } else {
                dialogRef.close(true);
            }
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

    createFsClick(row) {
        this.fsProject = row;
        const dialogRef = this.dialog.open(this.callCreateFsDialog, {
            width: '450px',
            position: {
                top: '15vh',
                left: '35vw',
            },
        });
    }

    closeReportDownloadDialog() {
        this.dialog.closeAll();
    }

    clearSearchForm() {
        this.form.reset();
        this.populateForm();
        this.getAllApi();
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe((res) => {
            this.userGroup = res.res;
            if(this.userGroup.groupStatus == 'AGENCY-DESK'){

            }
        });
    }



}
