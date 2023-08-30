import {Component, OnInit, ViewChild} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectMovementService} from '../../../../configuration-management/services/project-movement.service';
import {ProjectMovementModel} from '../../../../configuration-management/models/project-movement.model';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {ProjectType} from '../../../../configuration-management/models/project-type.model';
import {DEFAULT_PAGE, DEFAULT_SIZE, MAX_PAGE_SIZE} from '../../../../../core/constants/constant';
import {ProjectTypeService} from '../../../../configuration-management/services/project-type.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ProjectSummaryService} from '../../../services/project-summary.service';
import {ProjectMovementService as StageMovementService} from '../../../../dpp-tapp-management/services/project-movement.service';
import {MatSort} from '@angular/material/sort';
import {SectorDivisionModel} from '../../../../configuration-management/models/sector-division.model';
import {SectorDivisionService} from '../../../../configuration-management/services/sector-division.service';
import {Router} from '@angular/router';
import {IProjectConcept} from '../../../models/project-concept';
import {ApprovalStatusService} from "../../../../configuration-management/services/approvalStatusService.service";
import {ApprovalStatus} from "../../../../configuration-management/models/approvalStatus.model";
import {DatePipe} from '@angular/common';
import * as bl2Js from 'bl2-js-report';
import {
    locale as lngEnglishNav,
    locale as lngEnglishAction
} from '../../../../../../layout/layouts/vertical/classy/i18n/en';
import {locale as lngBanglaNav} from "../../../../../../layout/layouts/vertical/classy/i18n/bn";
import {FuseNavigationService} from "../../../../../../../@fuse/components/navigation";
import {TranslateService} from "@ngx-translate/core";
import {LayoutHelperService} from "../../../../../../layout/layouts/vertical/services/layout-helper.service";
import {ClassyLayoutComponent} from '../../../../../../layout/layouts/vertical/classy/classy.component';
import {SectorService} from "../../../../configuration-management/services/sector.service";
import {SectorModel} from "../../../../configuration-management/models/sector.model";
import {ProjectMovementStageConstant} from "../../../../dpp-tapp-management/constants/project-movement-stage-constant";
import {CommentSourceEnum} from "../../../enums/comment-source.enum";
import {map, switchMap} from "rxjs/operators";
import { environment, reportBackend } from 'environments/environment';
import { UserGroupService } from 'app/main/modules/configuration-management/services/user-group.service';


@Component({
    selector: 'app-project-concept-list',
    templateUrl: './project-concept-list.component.html',
    styleUrls: ['./project-concept-list.component.scss']
})
export class ProjectConceptListComponent extends UnsubscribeAdapterComponent implements OnInit {

    // table column
    displayedColumns: string[] = ['sl', 'projectName', 'total', 'gob', 'pa', 'ownFund', 'other'];
    displayedColumns2: string[] = ['thSl', 'thProjectName', 'thProjectCost'];

    dataSource: MatTableDataSource<IProjectConcept>;

    form: any;

    // for project movement status
    projectMovementList: Array<ProjectMovementModel>;
    colors: string[] = ['#035d92', '#5f97f6', '#009254', '#c58200', '#e26800', '#047984', '#4b778d'];
    colorList: string[] = [];
    approvalStatusColorList: string[] = [];
    projectTypeList: Array<ProjectType>;
    // approvalStatusList: Array<ApprovalStatus>;
    sectorDivisionList: Array<SectorDivisionModel>;
    sectorList: Array<SectorModel>;
    movementStageConstant = ProjectMovementStageConstant;
    navigationPage = environment.ibcs.navigateToUui;

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    actionPermission = [];
    selectedLanguage: any;
    navigation;
    show = true;
    _changeInterval = null;
    searchText = "";
    //actionSubject = new BehaviorSubject<any>(false);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('table') table: MatTable<any>;

    userGroupModel: any;
    isCreateProjectConcept: boolean = false;

    data: any = {};
    projectSummaryList: any[] = [];
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private projectMovementService: ProjectMovementService,
                private stageMovementService: StageMovementService,
                private projectTypeService: ProjectTypeService,
                private approvalStatusService: ApprovalStatusService,
                private projectSummaryService: ProjectSummaryService,
                private sectorDivisionService: SectorDivisionService,
                private sectorService: SectorService,
                private router: Router,
                public datePipe: DatePipe,
                private _fuseNavigationService: FuseNavigationService,
                private _translateService: TranslateService,
                private layoutHelperService: LayoutHelperService,
                private classyLayoutComponent: ClassyLayoutComponent,
                private userGroupService: UserGroupService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this._translateService.use('en');
        this.populateForm();
        this.layoutHelperService.changeNavLanguage('en');
        // this.getProjectMovementList();
        // this.getProjectTypeList();
        // this.getApprovalStatusList();
        this.getUserGroup();
        this.getAllApi();

        this.actionPermission = lngEnglishAction.data.ACTION;
        if (this.actionPermission == null)
            this.callActionSubject();
        else
            this.show = false;
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userGroupModel = res.res;
            if(this.userGroupModel.groupStatus == 'AGENCY-DESK'){
                this.isCreateProjectConcept = true;
            }
        });
    }

    private getAllApi() {
        this.subscribe$.add(
            this.sectorService.getActiveSector().pipe(
                switchMap(sector => this.sectorDivisionService.getActiveSectorDivision().pipe(
                    map(sectorDivision => ({
                        sector: sector,
                        sectorDivision: sectorDivision
                    }))
                ))
            ).subscribe(res => {
                this.sectorList = res.sector;
                this.sectorDivisionList = res.sectorDivision;
                this.searchByCriteria();
            })
        )
    }

    callActionSubject() {
        this.classyLayoutComponent.actionData.subscribe(res => {
            this.show = res;
            this.actionPermission = lngEnglishAction.data.ACTION;
        })
    }

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
            const isFsRequired = false;
            // const projectName = this.form.value.projectName === '' ? null : this.form.value.projectName;
            const sector = this.form.value.sector === '' ? null : this.form.value.sector;
            const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
            const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
            const status = this.form.value.status === '' ? null : this.form.value.status;

            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, this.searchText, sector, lowAmount, highAmount, status, CommentSourceEnum.PROJECT_SUMMARY, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
            })
            clearInterval(this._changeInterval)
        }, 500);
    }

    private setDefaultValue() {
        this.total = 0;
        this.page = DEFAULT_PAGE;
        this.size = DEFAULT_SIZE;
    }

// applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     this.dataSource.filter = filterValue.trim().toLowerCase();
    //
    //     if (this.dataSource.paginator) {
    //         this.dataSource.paginator.firstPage();
    //     }
    // }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        const searchText = this.searchText === "" ? (this.form.value.projectName === '' ? null : this.form.value.projectName) : this.searchText;
        this.commonSearchCriteria(searchText);
    }

    // for get ProjectMovement List
    // private getProjectMovementList() {
    //     this.subscribe$.add(
    //         this.projectMovementService.getAllProjectMovementByOrderIdAndModule(1).subscribe(res => {
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

    // for get Project Type List
    private getProjectTypeList() {
        this.subscribe$.add(
            this.projectTypeService.getListWithPagination(this.page, MAX_PAGE_SIZE).subscribe(res => {
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
            this.sectorDivisionService.getActiveSectorDivision().subscribe(res => {
                this.sectorDivisionList = res;
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

    // for data init and form load
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

    getByCriteria() {
        this.setDefaultValue();
        this.searchByCriteria();
    }

    // search project summary list by project type, sector division and funding type
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
        const isFsRequired = false;
        const projectName = searchText;
        const sector = this.form.value.sector === '' ? null : this.form.value.sector;
        const lowAmount = this.form.value.lowAmount ? this.form.value.lowAmount : null;
        const highAmount = this.form.value.highAmount ? this.form.value.highAmount : null;
        const status = this.form.value.status === '' ? null : this.form.value.status;

        this.subscribe$.add(
            this.projectSummaryService.projectSummaryCriteriaBasedSearch(projectType, sectorDivision,
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.PROJECT_SUMMARY, this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
                this.total = res.totalElements;
            })
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
                gob, isForeignAi, isFsRequired, projectName, sector, lowAmount, highAmount, status, CommentSourceEnum.PROJECT_SUMMARY).subscribe(res => {
                this.arrangeData(res.content);
                this.downloadPdf('projectConcept')
            })
        );
    }

    downloadPdf($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'pps-reports/dpp/projectConcept';
        // this.data['lng'] = localStorage.getItem("currentLang");

        this.data['projectSummaryList'] = JSON.stringify(this.projectSummaryList);

        const form = document.createElement('form');
        form.target = '_blank';
        form.method = 'post';
        form.action = `${reportBackend}/pdf-generate-post`
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);

        // form.action = `${reportBackend}/pdf-generate-post`
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
    
    private arrangeData(res: IProjectConcept[]) {
            this.projectSummaryList =  res.map(m => ({
            ...m,
            movementStatus: m.status ? m.status.split('_').join(' ') : 'AGENCY DESK',
            sectorDivisionName: this.sectorDivisionList.filter(e => e.id === m.sectorDivisionId).map(m => m.sectorDivisionNameEn),
            commencementDate: this.datePipe.transform(m.expCommencementDate, 'dd/MM/yyyy'),
            completionDate: this.datePipe.transform(m.expCompletionDate, 'dd/MM/yyyy')
        }));
        return this.projectSummaryList;
    }
    // private arrangeData(res: IProjectConcept[]) {
    //     this.projectSummaryList = res.map(m => ({
    //         ...m,
    //         movementStatus: m.status ? m.status== 'ECNEC_OFFICERS' ? "ECNEC WINGS": m?.status.split('_').join(' ') : 'AGENCY DESK',
    //         sectorDivisionName: this.sectorDivisionList.filter(e => e.id === m.sectorDivisionId).map(m => m.sectorDivisionNameEn),
    //         titleEn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleEn(m, this.dppObjectiveAndCostList) : this.getTitleEn(m, this.tappObjectiveAndCostList),
    //         titleBn: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.getTitleBn(m, this.dppObjectiveAndCostList) : this.getTitleBn(m, this.tappObjectiveAndCostList),
    //         commencementDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCommencementDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCommencementDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy'),
    //         completionDate: (m.projectTypeDTO.nameEn.toLowerCase() === 'dpp') ? this.datePipe.transform(this.getCompletionDate(m, this.dppObjectiveAndCostList), 'dd/MM/yyyy') : this.datePipe.transform(this.getCompletionDate(m, this.tappObjectiveAndCostList), 'dd/MM/yyyy')
    //     }));
    //     return this.projectSummaryList;
    // }
    edit(row) {
        this.router.navigate([`project-concept/edit-dashboard/${row.uuid}`]);
        // this.router.navigate([`project-concept/add-project-concept/${row.id}`]);
    }

    viewDashboard(row) {
        this.router.navigate([`project-concept/view-dashboard/${row.uuid}`]);
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

    gotToDashboard(row) {
        if (this.actionPermission?.includes('View Project Concept Dashboard')) {
            this.router.navigate([`project-concept/view-dashboard/${row.uuid}`]);
        }
        // this.stageMovementService.getCurrentStageInPc(row.id).subscribe(async res => {
        //     if (res.res) {
        //         if (res.res.currentStage === ProjectMovementStageConstant.AGENCY_DESK) {
        //             await this.router.navigate([`project-concept/edit-dashboard/${row.uuid}`]);
        //         } else {
        //             await this.router.navigate([`project-concept/view-dashboard/${row.uuid}`]);
        //         }
        //     } else {
        //         await this.router.navigate([`project-concept/edit-dashboard/${row.uuid}`]);
        //     }
        // });
    }

    clearSearchForm() {
        this.form.reset();
        this.populateForm();
        this.searchText = "";
        this.getAllApi();
    }



}
