import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {LinkupProposalWithEvaluatorsModel} from "../../../../../../rpm/models/LinkupProposalWithEvaluatorsModel";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {ToastrService} from "ngx-toastr";
import {locale as lngEnglish} from "../../../../others/cheque-collections/i18n/en";
import {locale as lngBangla} from "../../../../others/cheque-collections/i18n/bn";
import {ConfirmDialogConstant} from "../../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {closeIcon, previousIcon, saveIcon, sendIcon} from 'app/main/modules/rpm/constants/button.constants';
import {ChequeCollectionService} from "../../../../../services/cheque-collection.service";
import {FileUploadService} from "../../../../../../../shared/services/file-upload.service";
import {FileUploadModel} from "../../../../../../../shared/model/file-upload.model";

@Component({
    selector: 'app-upload-signature-modal',
    templateUrl: './upload-signature-modal.component.html',
    styleUrls: ['./upload-signature-modal.component.scss']
})
export class UploadSignatureModalComponent implements OnInit {

    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    linkupProposalWithEvaluatorsObj: any = {};


    saveIcon = saveIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    closeIcon = closeIcon;
    filePresent: string;
    update: boolean;
    spinner = false;
    viewFlag: boolean;
    toolbar = {toolbar: [[]]};

    fileUploadModel: FileUploadModel;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: any,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialog: MatDialog,
        private _checkCollectionService: ChequeCollectionService,
        private _toastService: ToastrService,
        private _fileUploadService: FileUploadService) {

        this.linkupProposalWithEvaluatorsObj = data;
        this.viewFlag = this.linkupProposalWithEvaluatorsObj.viewFlag;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {

    }

    onSubmit(send: boolean) {
        this.openDialog(send);
    }

    onClose(value: boolean) {
        this.dialog.closeAll();
    };

    uploadFile(files: any, tag: string) {
        console.log(files[0].name + " " + tag)
        this.filePresent = files[0].name;
        if (tag === 'signature-document') {
            this._fileUploadService.uploadFile(files[0], files[0].name, 'rms-ti').subscribe(data => {
                this.fileUploadModel = data;
            })
        }
    }

    private openDialog(send: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '50%';
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: 'Are you sure you want to send this letter?'};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                console.log(this.linkupProposalWithEvaluatorsObj.id)

                this._checkCollectionService.uploadSignatureDocument(this.linkupProposalWithEvaluatorsObj.id, this.fileUploadModel).subscribe(
                    data => {

                        this._toastService.success("File Upload Successful", "Success")
                    }, error => {
                        console.log(error)
                    }
                )

                this.onClose(true)
            }
            dialogRef.close(true);
        });
    }
}
