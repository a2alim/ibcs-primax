import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {UnsubscribeAdapterComponent} from 'app/main/core/helper/unsubscribeAdapter';
import {ApiService} from 'app/main/core/services/api/api.service';
import {DataComService} from 'app/main/core/services/data-com/data-com.service';
import {GlobalValidationServiceService} from 'app/main/core/services/global-validation-service.service';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {FeedbackBetweenEvaluatorAndResearcher} from 'app/main/modules/rpm/models/FeedbackBetweenEvaAndResearcher';
import {FeedbackListService} from 'app/main/modules/rpm/services/feedback-list.service';
import {FORM_TYPES_NO} from 'app/main/modules/settings/enum-list.enum';
import {CommonTypeService} from 'app/main/modules/settings/services/common-type.service';
import {FiscalYearServiceService} from 'app/main/modules/settings/services/fiscal-year-service.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {SendFeedBackModalComponent} from './send-feed-back-modal/send-feed-back-modal.component';
import {AuthService} from 'app/main/modules/auth/services/auth.service';
import {StorageService} from 'app/main/core/services/storage/storage.service';
import {ExpertEvaluatorService} from 'app/main/modules/settings/services/expert-evaluator.service';
import {refreshBtn} from 'app/main/modules/settings/constants/button.constants';

@Component({
    selector: 'app-feedback-list-page',
    templateUrl: './feedback-list-page.component.html',
    styleUrls: ['./feedback-list-page.component.scss']
})
export class FeedbackListPageComponent extends UnsubscribeAdapterComponent implements OnInit {


    spinner = false;
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    dataSource: any = [];
    fiscalYearList: any[] = [];
    researchTittleList: any[] = [];
    researcherNameList: any[] = [];
    presentationStatusList = [];
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false };

    data = {};

    subscription: Subscription;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    refreshBtn = refreshBtn;


    sendDataForGrid: {
        researcherProposalId: number,
        researcherProfilePersonalInfoMasterId: number,
        stFiscalYearId: number,
        presentationStatus: string,
        expertEvaluatorsId: number,
        userId: number,
        pageableRequestBodyDTO: { page: number, size: number }
    } = {
        researcherProposalId: null,
        researcherProfilePersonalInfoMasterId: null,
        stFiscalYearId: null,
        presentationStatus: null,
        expertEvaluatorsId: null,
        userId: null,
        pageableRequestBodyDTO: {page: this.page, size: this.pageSize}
    };

    displayedColumns: string[] = ['sl', 'research_title', 'researcher_name', 'total_feedback', 'new_feedback', 'complete_feedback', 'presentation_completed', 'action'];

    constructor(
        private _feedbackListService: FeedbackListService,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private globalVal: GlobalValidationServiceService,
        private _fiscalYearService: FiscalYearServiceService,
        private _route: Router,
        private _dialog: MatDialog,
        private commonTypeService: CommonTypeService,
        private authService: AuthService,
        private storageService: StorageService,
        private expertEvaluatorService: ExpertEvaluatorService) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.frmGroup = this.formBuilder.group({
            researcherProposalId: [''],
            researcherProfilePersonalInfoMasterId: [''],
            stFiscalYearId: [''],
            presentationStatus: ['']
        });
        this.userDetails = this.storageService.getUserData();
        this.getFiscalYearList();
        this.getPresentationStatus();
        this.onInit();
    }


    onReset() {

        this.frmGroup.reset();
        this.sendDataForGrid.researcherProposalId = null;
        this.sendDataForGrid.researcherProfilePersonalInfoMasterId = null;
        this.sendDataForGrid.stFiscalYearId = null;
        this.sendDataForGrid.presentationStatus = null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
        this.onInit();
    }

    // ON SUBMIT SURSE
    onSubmit() {

        const researcherProposalId = this.frmGroup.value.researcherProposalId;
        const researcherProfilePersonalInfoMasterId = this.frmGroup.value.researcherProfilePersonalInfoMasterId;
        const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
        const presentationStatus = this.frmGroup.value.presentationStatus;


        this.sendDataForGrid.researcherProposalId = researcherProposalId ? researcherProposalId : null;
        this.sendDataForGrid.researcherProfilePersonalInfoMasterId = researcherProfilePersonalInfoMasterId ? researcherProfilePersonalInfoMasterId : null;
        this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
        this.sendDataForGrid.presentationStatus = presentationStatus ? presentationStatus : null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
        this.onInit();
    }


    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {

        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page


        const researcherProposalId = this.frmGroup.value.researcherProposalId;
        const researcherProfilePersonalInfoMasterId = this.frmGroup.value.researcherProfilePersonalInfoMasterId;
        const stFiscalYearId = this.frmGroup.value.stFiscalYearId;
        const presentationStatus = this.frmGroup.value.presentationStatus;


        this.sendDataForGrid.researcherProposalId = researcherProposalId ? researcherProposalId : null;
        this.sendDataForGrid.researcherProfilePersonalInfoMasterId = researcherProfilePersonalInfoMasterId ? researcherProfilePersonalInfoMasterId : null;
        this.sendDataForGrid.stFiscalYearId = stFiscalYearId ? stFiscalYearId : null;
        this.sendDataForGrid.presentationStatus = presentationStatus ? presentationStatus : null;

        this.sendDataForGrid.pageableRequestBodyDTO.page = this.page;
        this.sendDataForGrid.pageableRequestBodyDTO.size = this.pageSize;
        this.onInit();
    }


    // =============  FEEDBACK_LIST ===============
    getGridList() {
        this.spinner = true;
        this._feedbackListService.getFeedbackGridList(this.sendDataForGrid).subscribe(res => {

                this.dataSource = new MatTableDataSource(res.content ? res.content : []);
                this.totalElements = res.totalElements;
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    // change FIlter Field
    onChangeFiscalYear(event: any) {
        if (event.value) {
            this.getResearchTittleList(event.value);
        }
    }

    onSelectResearchTitle(event: any) {
        if (event.value) {
            this.getResearcherNameList(event.value);
        }
    }

    onSelectResearcherName(event: any) {

    }


    getFiscalYearList() {

        this.spinner = true;
        this._feedbackListService.findFiscalYear().subscribe(
            response => {
                this.fiscalYearList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }


    getResearchTittleList(fiscalYearId) {

        this.spinner = true;
        this._feedbackListService.findResearchTittle(fiscalYearId).subscribe(
            response => {
                this.researchTittleList = response.items ? response.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
                this.researchTittleList = [];
            }
        );
    }


    getResearcherNameList(researcherProposalId) {
        this.spinner = true;
        this._feedbackListService.findResearcherName(researcherProposalId).subscribe(
            response => {
                this.researcherNameList = response.items ? response.items : [];
                this.frmGroup.patchValue({researcherProfilePersonalInfoMasterId: this.researcherNameList ? this.researcherNameList[0].researcherProfilePersonalInfoMasterId : ''});
                this.spinner = false;
            },
            error => {
                this.spinner = false;
                this.researcherNameList = [];
            }
        );
    }

    private getPresentationStatus() {
        this.spinner = true;
        this.subscribe$.add(
            this.commonTypeService.findAllByActiveData(FORM_TYPES_NO.PRESENTATION_STATUS).subscribe(res => {
                if (res) {
                    this.presentationStatusList = res;
                }
                this.spinner = false;
            })
        );
    }


    sendFeedbackToResearcher(data: any) {

        const feedbackBetweenEvaluatorAndResearcher = new FeedbackBetweenEvaluatorAndResearcher();
        feedbackBetweenEvaluatorAndResearcher.m2ResearcherPresentationId = data.researcherPresentationId ? data.researcherPresentationId : null;
        feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalId = data.researcherProposalId ? data.researcherProposalId : null;
        feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalUuid = data.researcherProposalUuid;
        feedbackBetweenEvaluatorAndResearcher.m2CreateSeminarId = data.createSeminarId ? data.createSeminarId : null;
        feedbackBetweenEvaluatorAndResearcher.sendTo = 'Researcher';
        feedbackBetweenEvaluatorAndResearcher.userId = data.userId;

        this.sendFeedbackModal(feedbackBetweenEvaluatorAndResearcher);
    }


    sendFeedbackToEvaluator(data: any) {

        const feedbackBetweenEvaluatorAndResearcher = new FeedbackBetweenEvaluatorAndResearcher();
        feedbackBetweenEvaluatorAndResearcher.m2ResearcherPresentationId = data.researcherPresentationId ? data.researcherPresentationId : null;
        feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalId = data.researcherProposalId ? data.researcherProposalId : null;
        feedbackBetweenEvaluatorAndResearcher.m1ResearcherProposalUuid = data.researcherProposalUuid;
        feedbackBetweenEvaluatorAndResearcher.m2CreateSeminarId = data.createSeminarId ? data.createSeminarId : null;
        feedbackBetweenEvaluatorAndResearcher.sendTo = 'Evaluator';
        feedbackBetweenEvaluatorAndResearcher.userId = null;

        this.sendFeedbackModal(feedbackBetweenEvaluatorAndResearcher);

    }

    sendFeedbackModal(feedbackBetweenEvaluatorAndResearcher: FeedbackBetweenEvaluatorAndResearcher) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '80%';
        dialogConfig.height = '95%';
        dialogConfig.data = {...feedbackBetweenEvaluatorAndResearcher};

        const dialogRef = this._dialog.open(SendFeedBackModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }


    goToFeedbackList(data) {
        this.router.navigate(['feedback-list/' + data.researcherProposalUuid]);
    }

    onInit() {
        if (this.userDetails.userType == 'Rms_DO') {
            this.getGridList();
        }

        if (this.userDetails.userType == 'Rms_Researcher') {
            this.sendDataForGrid.userId = this.userDetails.id;
            this.getGridList();
        }

        if (this.userDetails.userType == 'Rms_Evaluator') {
            this.findEvaluatorUserId(this.userDetails.id, response => {
                if (response) {
                    this.sendDataForGrid.expertEvaluatorsId = response.id;
                    this.getGridList();
                } else {
                    console.log('Not Found ..........');
                }
            });
        }
    }


    findEvaluatorUserId(userId: number, callback) {
        this.expertEvaluatorService.findByUserId(userId).subscribe(
            response => {
                if (response.success && response.obj) {
                    callback(response.obj);
                } else {
                    callback(false);
                }
            },
            error => {
                callback(false);
            }
        );
    }


    showPresentationStatus(id: number) {
        if (!id) {
            return '';
        }
        let data = this.presentationStatusList.find(f => f.id == id);
        if (!data) {
            return '';
        }
        return data.typeName;
    }

}
