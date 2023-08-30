import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ResearcherProposal } from 'app/main/modules/rpm/models/ResearcherProposal';
import { AppResearcherProposalUploadDocService } from 'app/main/modules/rpm/services/app-researcher-proposal-upload-doc.service';
import { FileValidatorService } from 'app/main/modules/rpm/services/file-validator.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { FileUploadService } from 'app/main/shared/services/file-upload.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UnsubscribeAdapterComponent } from '../../../../../../../core/helper/unsubscribeAdapter';
import { FuseTranslationLoaderService } from '../../../../../../../core/services/translation-loader.service';
import { ResearcherProposalUploadDoc } from '../../../../../models/ResearcherProposalUploadDoc';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    selector: 'app-researcher-proposal-upload-doc',
    templateUrl: './researcher-proposal-upload-doc.component.html',
    styleUrls: ['./researcher-proposal-upload-doc.component.scss'],
})
export class ResearcherProposalUploadDocComponent
    extends UnsubscribeAdapterComponent
    implements OnInit
{
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    spinner = true;
    existingProposalInfoId: number;
    uploadDocsList: ResearcherProposalUploadDoc[] = [];
    documentTypeList: any[] = [];
    updatedFileList: any[] = [];
    fileList: File[] = new Array();
    canSave: boolean;
    formSubmit: boolean;
    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    langVal: string;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    holdImageData = [];
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _toastrService: ToastrService,
        private snackbarHelper: SnackbarHelper,
        private _appResearcherProposalUploadDocService: AppResearcherProposalUploadDocService,
        private api: ApiService,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private _fileValidatorService: FileValidatorService,
        private _fileUploadService: FileUploadService
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.langVal = localStorage.getItem('currentLang');
        this.dataCom.getPassedItemData.subscribe((res) => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }
    ngOnInit(): void {
        this.addNewRow();
        this.getCommonTypeListData();
        this.spinner = false;
    }
    addNewRow() {
        this.uploadDocsList.push({
            id: null,
            uuid: null,
            researcherProposalId: this.existingProposalInfoId,
            researcherProposalUuid: null,
            stDocumentTypeId: null,
            docName: '',
            briefOnDocument: '',
            fileDownloadUrl: '',
            bucketName: '',
            fileName: '',
            isEditable: 0,
            deleted: 0,
            documentTypeName: '',
        });
    }
    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.existingProposalInfoId =
                                this.existingProposalInfo.id;
                            this.getByResearcherProposalId(
                                this.existingProposalInfo.id
                            );
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe((res) => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalInfoId = res.id;
                                this.getByResearcherProposalId(res.id);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }
    deleteFormByIndex(data, i: any) {
        if (data.id) {
            //this.uploadDocsList[i].deleted = 1;
            this.openDialog(i);
        } else {
            this.uploadDocsList.splice(i, 1);
        }
        if (this.updatedFileList[i] && this.fileList[i]) {
            this.updatedFileList.splice(i, 1);
            this.fileList.splice(i, 1);
        }
    }
    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.uploadDocsList[i].deleted = 1;
                this.save(false, true);
            }
            dialogRef.close(true);
        });
    }

    UploadToMinio(files, index, callback) {
        this._fileUploadService
            .uploadFile(files[0], files[0].name, 'rms')
            .subscribe((data) => {
                if (data) {
                    this.uploadDocsList[index].fileDownloadUrl =
                        data?.downloadUrl;
                    this.uploadDocsList[index].bucketName = data?.bucketName;
                    this.uploadDocsList[index].fileName = data?.fileName;
                    callback(true);
                }
                callback(false);
            });
    }

    save(next: boolean, del: boolean = false) {
        this.formSubmit = true;
        if (!this.checkRequirdField()) {
            this._toastrService.warning('Please enter the required information !.','',this.config);
            return;
        }
        //If new upload file is empty
        if (this.holdImageData.length < 1 || this.holdImageData == null) {
            this.FinallySave(next, del);
        }
        //If new upload fils is not empty
        this.holdImageData.forEach((val, i) => {
            this.UploadToMinio(val.file, val.index, (res) => {
                if (res == true && i + 1 == this.holdImageData.length) {
                    this.FinallySave(next, del);
                }
            });
        });
    }
    
    FinallySave(next: boolean, del: boolean = false) {
        this.spinner = true;
        this.canSave = false;
        this.spinner = true;
        this.uploadDocsList = this.uploadDocsList.map((m) => ({...m, researcherProposalId: this.existingProposalInfoId,
        }));

        this._appResearcherProposalUploadDocService
            .onSaveOrUpdateList(this.uploadDocsList)
            .subscribe(
                (response) => {
                    if (response.success) {
                        this.spinner = false;
                        this.canSave = true;
                        this.uploadDocsList = response.items.map((m) => ({...m, deleted: 0}));
                        this.fileList = [];
                        this.updatedFileList = [];
                        if (del) {
                            this.snackbarHelper.deleteSuccessSnackBar();
                        } else {
                            this.snackbarHelper.openSuccessSnackBar();
                        }
                        if (next) {
                            this.nextTab();
                        }
                    } else {
                        this.snackbarHelper.openErrorSnackBar();
                        this.canSave = true;
                        this.spinner = false;
                    }
                },
                (error) => {
                    console.log('error ==== >>>> ', error);
                    this.canSave = true;
                    this.spinner = false;
                }
            );
    }
    handleFileInput(file: FileList, index: number, id: number) {
        /*_____________File Extension and File Size Validation ______________*/
        var validExt = ['pdf', 'doc', 'docm', 'docx', 'jpg', 'jpeg', 'png'];
        var isExtension = this._fileValidatorService.checkFileExtension(
            file,
            validExt
        );
        if (!isExtension) {
            this._toastrService.error(
                'You can upload only pdf, doc, docm, docx, jpg, jpeg and png file',
                ''
            );
            return;
        }
        var needFileSize = 4; //MB
        var isSize = this._fileValidatorService.checkUploadFileSize(
            file,
            needFileSize
        );
        if (!isSize) {
            this._toastrService.error(
                'File size should be less then or equal ' + needFileSize + 'MB',
                ''
            );
            return;
        }
        /*_____________/File Extension and File Size Validation ______________*/
        //this.holdImageData[index] = file.item(0) ? file.item(0).name : '';
        this.holdImageData.push({
            index: index,
            file: file.item(0) ? file : '',
        });
        console.log('this.holdImageData leng', this.holdImageData.length);
    }
    getByResearcherProposalId(id: number) {
        this.subscribe$.add(
            this._appResearcherProposalUploadDocService
                .findByResearcherProposalId(id)
                .subscribe((res) => {
                    if (res.success) {
                        this.uploadDocsList = res.items.map((m) => ({
                            ...m,
                            deleted: 0,
                        }));
                    }
                })
        );
    }
    /*
     * Bottom Default Tab Options
     * */
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    getCommonTypeListData() {
        const baseUrl =
            environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
        const getUrl = baseUrl + 'get-list';
        this.api.get(getUrl).subscribe((res) => {
            if (res.success && res.items) {
                this.documentTypeList = res.items;
                this.documentTypeList = this.documentTypeList.filter(
                    (f) => f.typeNo == 3
                )
                    ? this.documentTypeList.filter((f) => f.typeNo == 3)
                    : [];
            }
        });
    }
    checkRequirdField(): Boolean {
        let isValied = true;
        this.uploadDocsList.forEach((f, index) => {
            if (!f.docName || !f.fileName) {
                return (isValied = false);
            }
        });
        return isValied;
    }
}
