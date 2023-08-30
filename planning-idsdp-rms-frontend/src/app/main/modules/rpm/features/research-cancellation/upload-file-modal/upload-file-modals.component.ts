import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";

import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import {messages} from "../../../../../../mock-api/common/messages/data";
import {UploadFileActionFormModel, UploadFileFormModel} from "../../../models/UploadFileFormModel";
import {CreateGoLetterServiceService} from "../../../services/create-go-letter-service.service";
import {SubSink} from "subsink";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {ResearchCancellationServiceService} from "../../../services/research-cancellation-service.service";

@Component({
  selector: 'app-upload-file-modals',
  templateUrl: './upload-file-modals.component.html',
  styleUrls: ['./upload-file-modals.component.scss']
})
export class UploadFileModalsComponent implements OnInit {

    uploadFileFormModelList: UploadFileActionFormModel[] = [];
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
                private _toastrService: ToastrService,
                private _activatedRoute: ActivatedRoute,
                private snackbarHelper: SnackbarHelper,
                private researchAction: ResearchCancellationServiceService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        //Set Default
        this.addNewForm();
    }

    ngOnInit(): void {
        this.getByGeoLetterId();
    }

    addNewForm() {
        this.uploadFileFormModelList.push(
            {
                id: null,
                uuid: null,
                takeActionForResearchId: this.researchAction.data,
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
        this.spinner = true;
        this.uploadFileFormModelList = this.uploadFileFormModelList.map(m => ({ ...m, takeActionForResearchId: this.researchAction.data}));
        this.researchAction.saveFile(this.uploadFileFormModelList, this.fileList, this.updatedFileList).subscribe(
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
                this.spinner = false;
            }
        );
    }

    handleFileInput(file: FileList, index: number, id: number) {
        this.fileList.push(file.item(0));
        this.updatedFileList[index] = id ? id : 1000 + index;
    }

    getByGeoLetterId() {
        this.subscribe$.add(
            this.researchAction.getUploadFileList(this.researchAction.data).subscribe(res => {
                if (res.success) {
                    this.uploadFileFormModelList = res.items.map(m => ({ ...m, deleted: 0 }));
                }
            })
        );
    }

}
