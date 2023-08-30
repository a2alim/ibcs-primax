import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { ERROR, OK, SUCCESSFULLY_SAVE } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AuthService } from 'app/main/modules/auth/services/auth.service';
import {
    addNewIcon,
    downloadIcon,
    editIcon,
    noteIcon,
    previousIcon,
    printIcon, saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { PresentationEvaluatorsFeedback } from 'app/main/modules/rpm/models/PresentationEvaluatorsFeedback';
import { ResearcherProposalUploadDoc } from 'app/main/modules/rpm/models/ResearcherProposalUploadDoc';
import { AppResearcherProposalUploadDocService } from 'app/main/modules/rpm/services/app-researcher-proposal-upload-doc.service';
import { PresentationEvaluatorsFeedbackService } from 'app/main/modules/rpm/services/presentation-evaluators-feedback.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment,reportBackend } from 'environments/environment';
import { StorageService } from "../../../../../../../core/services/storage/storage.service";
import { ResearcherProposal } from "../../../../../models/ResearcherProposal";
import { JasperServiceService } from "../../../../../services/jasper-service.service";
import { ResearcherProposalService } from "../../../../../services/researcher-proposal.service";
import { FeedbackEditModalComponent } from '../feedback-edit-modal/feedback-edit-modal.component';
import { locale as lngBangla } from "../i18n/bn";
import { locale as lngEnglish } from "../i18n/en";
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-feedback-list',
    templateUrl: './feedback-list.component.html',
    styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {

    @ViewChild('f') mytemplateForm: any;
    researcherProposalUuid: string;
    spinner = false;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;
    saveIcon = saveIcon;
    /*----/Button---*/

    feedbackList: any[] = [];
    // evaluatorList: any[] = [];
    // researchCategoryTypeList: any[] = [];
    // fiscalYearList: any[] = [];
    documentTypeList: any[] = [];
    docFileList: ResearcherProposalUploadDoc[] = [];
    uploadDoc: ResearcherProposalUploadDoc = new ResearcherProposalUploadDoc();
    proposal: ResearcherProposal;
    spinner2: boolean = false;

    saveDisable: boolean = false;
    canExpand: boolean;
    file: File;
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false };
    user: any;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    data:any = {};
    minioFileDownloadEndPointHost: string = environment.ibcs.minioFileDownloadEndPointHost;


    constructor(private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProposalService: ResearcherProposalService,
        private _presentationEvaluatorsFeedbackService: PresentationEvaluatorsFeedbackService,
        private _dialog: MatDialog,
        private service: PresentationEvaluatorsFeedbackService,
        private _snackbarHelper: SnackbarHelper,
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
        private dialog: MatDialog,
        private api: ApiService,
        private _appResearcherProposalUploadDocService: AppResearcherProposalUploadDocService,
        private jasperService: JasperServiceService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.researcherProposalUuid = this.activateRoute.snapshot.paramMap.get('uuid');
        this.userDetails = this.storageService.getUserData();

        this.getProposal();
        this.getUser((res) => {
            if (this.researcherProposalUuid) {
                this.findAllByResearcherProposalId();
                this.getUploadedFileList();
            }
        });
        this.getCommonTypeListData();

        // this.getEvaluatorList();
        // this.getResearchCategoryTypeList();
        // this.getFiscalYearList();
    }

    private getProposal() {
        this.spinner = true;
        this.researcherProposalService.getByUuid(this.activateRoute.snapshot.paramMap.get('uuid')).subscribe(res => {
            if (res.success && res.obj) {
                this.proposal = res.obj;
            }
            this.spinner = false;
        });
    }

    private getUser(callback) {
        this.authService.getUserDetailsById(this.userDetails.id).subscribe(res => {
            this.user = res;
            this.findAllByResearcherProposalId();
        });
        callback(true);
    }


    findAllByResearcherProposalId() {
        this.spinner = true;
        this._presentationEvaluatorsFeedbackService.findAllByResearcherProposalId(this.researcherProposalUuid).subscribe(
            response => {
                if (response.success && response.items) {
                    this.feedbackList = [];
                    response.items.forEach((e, i) => {
                        this.feedbackList.push(
                            ({
                                ...e,
                                evaluatorAction: (this.userDetails.userType === 'Rms_DO' || (this.user.emailId === e.createdBy && this.userDetails.userType === 'Rms_Evaluator')) && !e.feedbackCompleted && !e.researcherFeedback,
                                researcherAction: (this.userDetails.userType === 'Rms_DO' || this.userDetails.userType === 'Rms_Researcher') && !e.feedbackCompleted,
                                completeAction: (this.userDetails.userType === 'Rms_DO' || this.userDetails.userType === 'Rms_Evaluator')
                            })
                        );
                        if (i === (response.items.length - 1)) {
                            this.spinner = false;
                        }
                    });
                } else this.spinner = false;
            },
            error => {
                this.spinner = false;
                console.log('error === >>> ', error);
            }
        );
    }


    // getResearchCategoryTypeList() {
    //     this.spinner = true;
    //     this._researchCategoryTypeService.getAllActiveList().subscribe(
    //         response => {
    //             this.researchCategoryTypeList = response.items ? response.items : [];
    //             this.spinner = false;
    //         }
    //     );
    // }


    // getFiscalYearList() {
    //     this.spinner = true;
    //     this._fiscalYearService.getAllActive().subscribe(
    //         response => {
    //             this.fiscalYearList = response.items ? response.items : [];
    //             this.spinner = false;
    //         },
    //         _ => {
    //             this.spinner = false;
    //         }
    //     );
    // }
    //
    //
    // getEvaluatorList() {
    //     this.spinner = true;
    //     this._expertEvaluatorService.getAll().subscribe(
    //         response => {
    //             this.evaluatorList = response.items ? response.items : [];
    //             this.spinner = false;
    //         },
    //         error => {
    //             console.log('error === >>>> ', error);
    //         }
    //     );
    //     this.spinner = false;
    // }
    //
    //
    // onShowEvaluator(evaluatorId: number) {
    //     if (!evaluatorId) {
    //         return '';
    //     }
    //     const findData = this.evaluatorList.find(f => f.id == evaluatorId);
    //     if (findData) {
    //         return findData.name;
    //     }
    //
    //     return '';
    // }
    //
    // onShowCategory(categoryId: number) {
    //     if (!categoryId) {
    //         return '';
    //     }
    //     const findData = this.researchCategoryTypeList.find(f => f.id == categoryId);
    //     if (findData) {
    //         return findData.categoryName;
    //     }
    //     return '';
    // }
    //
    // onShowFiscalYear(fiscalYearId: number) {
    //     if (!fiscalYearId) {
    //         return '';
    //     }
    //     const findData = this.fiscalYearList.find(f => f.id == fiscalYearId);
    //     if (findData) {
    //         return findData.fiscalYear;
    //     }
    //     return '';
    // }

    onEditEvaluatorFeedback(data: any) {
        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = data.feedbackCompleted;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = data.isNew;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = 'Evaluator'

        this.editFeedback(presentationEvaluatorsFeedback);
    }


    onEditResearcherFeedback(data: any) {
        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = data.feedbackCompleted;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = data.isNew;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = 'Researcher';

        this.editFeedback(presentationEvaluatorsFeedback);
    }


    editFeedback(presentationEvaluatorsFeedback: PresentationEvaluatorsFeedback) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = 'auto';
        dialogConfig.data = { ...presentationEvaluatorsFeedback };

        const dialogRef = this._dialog.open(FeedbackEditModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
                this.findAllByResearcherProposalId();
            }
        });
    }


    feedbackCompleted(event: any, data: any, index: number) {
        const presentationEvaluatorsFeedback = new PresentationEvaluatorsFeedback();
        presentationEvaluatorsFeedback.id = data.id;
        presentationEvaluatorsFeedback.uuid = data.uuid;
        presentationEvaluatorsFeedback.m2ResearcherPresentationId = data.researcherPresentation.id;
        presentationEvaluatorsFeedback.m1ResearcherProposalId = data.researcherProposal.id;
        presentationEvaluatorsFeedback.stProfileOfExpertEvaluatorsId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.m2AddNewMemberId = data.stProfileOfExpertEvaluatorsId;
        presentationEvaluatorsFeedback.isPresent = data.isPresent;
        presentationEvaluatorsFeedback.evaluatorFeedback = data.evaluatorFeedback;
        presentationEvaluatorsFeedback.pageNo1 = data.pageNo1;
        presentationEvaluatorsFeedback.researcherFeedback = data.researcherFeedback;
        presentationEvaluatorsFeedback.pageNo2 = data.pageNo2;
        presentationEvaluatorsFeedback.feedbackCompleted = event.checked;
        presentationEvaluatorsFeedback.isResearcherVisible = data.isResearcherVisible;
        presentationEvaluatorsFeedback.isNew = false;
        presentationEvaluatorsFeedback.isEditable = data.isEditable;
        presentationEvaluatorsFeedback.type = data.type;

        this.onSubmit(presentationEvaluatorsFeedback, index);
    }


    onSubmit(presentationEvaluatorsFeedback: PresentationEvaluatorsFeedback, index: number) {
        this.saveDisable = true;
        this.spinner = true;
        this.service.update(presentationEvaluatorsFeedback).subscribe(res => {
            if (res.success) {
                this.feedbackList[index].feedbackCompleted = res.obj.feedbackCompleted;
                this._snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_SAVE, OK);
            } else {
                this._snackbarHelper.openErrorSnackBarWithMessage(res.message, ERROR);
            }
            this.saveDisable = false;
            this.spinner = false;
        },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    delete(item: any) {

    }

    goPrevious() {
        this.router.navigate(['feedback-list-page']);
    }


    private onChangeFeedbackCompleted(event: any, data: any, index: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: `Are you sure that you want to complate feedback!.` };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.feedbackCompleted(event, data, index);
            }
            dialogRef.close(true);
        });
    }


    expand(expand: boolean): void {
        this.canExpand = expand;
    }


    getCommonTypeListData() {
        const baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
        const getUrl = baseUrl + 'get-list';
        this.api.get(getUrl).subscribe(res => {
            if (res.success && res.items) {
                this.documentTypeList = res.items;
                this.documentTypeList = this.documentTypeList.filter(f => f.typeNo == 3) ? this.documentTypeList.filter(f => f.typeNo == 3) : [];
            }
        });
    }


    uploadFile(file: FileList) {
        this.file = file.item(0);
    }

    onSaveFileDoc(f: any) {        

        this.uploadDoc.researcherProposalUuid = this.researcherProposalUuid;

        if (!this.uploadDoc.researcherProposalUuid) {
            return;
        }

        if (!this.uploadDoc.stDocumentTypeId) {
            return;
        }

        if (!this.uploadDoc.docName) {
            return;
        }

        if (!this.file) {
            return;
        }

        this.spinner = true;
        this.spinner = true;
        this._appResearcherProposalUploadDocService.uploadDocFile(this.uploadDoc, this.file).subscribe(
            response => {
                if (response.success) {
                    this._snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                    this.getUploadedFileList();
                    
                    this.uploadDoc.stDocumentTypeId = null;
                    this.uploadDoc.docName = '';
                    this.uploadDoc.briefOnDocument = '';
                    document.getElementById('fileName').getElementsByTagName('span')[0].innerText ='';
                    this.spinner = false;
                } else {
                    this._snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                    this.spinner = false;
                }
            },
            error => {
                this._snackbarHelper.openErrorSnackBarWithMessage("HTTP Error occeared !.", ERROR);
                console.log('error ==== >>>> ', error);
            }
        );
    }

    getUploadedFileList() {
        this.spinner = true;
        this._appResearcherProposalUploadDocService.findByResearcherProposalUuid(this.researcherProposalUuid).subscribe(
            response => {
                this.docFileList = response.items ? response.items : []
                this.spinner = false;
            },
            error => {
                this.spinner = false;
                this._snackbarHelper.openErrorSnackBarWithMessage("HTTP Error occeared !.", ERROR);
                console.log('error ==== >>>> ', error);
            }
        );
    }

    showDocumentTypeName(id: number) {
        if (!id) {
            return '';
        }
        return this.documentTypeList.find(f => f.id == id) ? this.documentTypeList.find(f => f.id == id).typeName : '';
    }


    downloadFile(data: any) {
        window.open(environment.ibcs.minioEndPointHost + data.fileDownloadUrl);
    }


    // previewReport(response, formate) {
    //     console.log('response ==== >>>> ', response);
    //     let file = new Blob([response], { type: this.printFormat(formate) });
    //     var fileURL = URL.createObjectURL(file);
    //     window.open(fileURL);
    // }

    // printFormat(formatKey: string) {
    //     let reportFormatMap = new Map();
    //     reportFormatMap.set('JPG', 'image/jpg');
    //     reportFormatMap.set('PNG', 'image/png');
    //     reportFormatMap.set('JPEG', 'image/jpeg');
    //     reportFormatMap.set('PDF', 'application/pdf');
    //     reportFormatMap.set('XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     reportFormatMap.set('DOCX', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    //     return reportFormatMap.get(formatKey.toUpperCase());
    // }

    // download() {
    //     this.spinner2 = true;
    //     let lang = localStorage.getItem("currentLang");
    //     this.jasperService.generateProposalFeedbackPdf(this.researcherProposalUuid, lang).subscribe((response) => {
    //         this.spinner2 = false;
    //         let file = new Blob([response], { type: 'application/pdf' });
    //         var fileURL = URL.createObjectURL(file);
    //         window.open(fileURL);
    //     }, error => {
    //         this.spinner2 = false;
    //     });
    // }

    download() {
        this.data['fileName'] = 'feebackList';
        this.data['templateName'] = 'rms-reports/feedbackList';
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['proposal'] = JSON.stringify(this.proposal);
        this.data['feedbackList'] = JSON.stringify(this.feedbackList);
        this.data['docFileList'] = JSON.stringify(this.docFileList);
        this.data['downloadUrl'] = JSON.stringify(this.minioFileDownloadEndPointHost);



        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;

        console.log('this.data', this.data);
        //return;

        bl2Js(this.data, actionUrl);
    }
}
