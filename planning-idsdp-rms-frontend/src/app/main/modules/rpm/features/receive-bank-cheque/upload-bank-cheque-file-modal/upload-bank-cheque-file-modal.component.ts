import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {ResearchProfileMultiFormService} from "../../../services/research-profile-multi-form.service";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {messages} from "../../../../../../mock-api/common/messages/data";
import {UploadbankChequeFileFormModel} from "../../../models/UploadFileFormModel";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReceiveBankChequeService } from '../../../services/receive-bank-cheque.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-upload-bank-cheque-file-modal',
    templateUrl: './upload-bank-cheque-file-modal.component.html',
    styleUrls: ['./upload-bank-cheque-file-modal.component.scss']
})
export class UploadBankChequeFileModalComponent implements OnInit {
    uploadFileFormModelList: UploadbankChequeFileFormModel[] = [];
    fileList: File[]= new Array();
    updatedFileList: any[] = [];
    subscribe$ = new SubSink();

    spinner = true;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    closeEventEmitter: any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data,
                private _toastrService: ToastrService,
                private _activatedRoute: ActivatedRoute,
                private snackbarHelper: SnackbarHelper,
                private bankChequeService: ReceiveBankChequeService,
                ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {
        this.getBankChequeById();
    }

    addNewForm() {
        this.uploadFileFormModelList.push(
            {
                id: null,
                uuid: null,
                receivedBankChequeId: this.data.id,
                fileTitle: '',
                fileName: '',
                bucketName: '',
                downloadUrl: '',
                isEditable: 0,
                deleted: 0
            }
        );
    }

    deleteFormByIndex(index: number) {
        if (index == 0) {
            return false;
        } else {
            this.uploadFileFormModelList.splice(index, 1)
        }
    }

    save(next: boolean) {
        console.log('uploadDocsList ==== >>>> ', this.uploadFileFormModelList);
        this.spinner = true;
        this.uploadFileFormModelList = this.uploadFileFormModelList.map(m => ({ ...m, receivedBankChequeId: this.data.id}));
        this.bankChequeService.saveFile(this.uploadFileFormModelList, this.fileList, this.updatedFileList).subscribe(
            response => {
                if (response.success) {
                    this.spinner = false;
                    this.uploadFileFormModelList = response.items.map(m => ({ ...m, deleted: 0 }));
                    this.fileList = [];
                    this.updatedFileList = [];
                    this.snackbarHelper.openSuccessSnackBar();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                }
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    handleFileInput(file: FileList, index: number, id: number) {
        this.fileList.push(file.item(0));
        this.updatedFileList[index] = id ? id : 1000 + index;
    }

    getBankChequeById() {
        this.subscribe$.add(
            this.bankChequeService.getBankChequeById(this.data.id).subscribe(res => {
                if (res.success) {
                    this.uploadFileFormModelList = res.items.map(m => ({ ...m, deleted: 0 }));
                }
            })
        );
    }

}
