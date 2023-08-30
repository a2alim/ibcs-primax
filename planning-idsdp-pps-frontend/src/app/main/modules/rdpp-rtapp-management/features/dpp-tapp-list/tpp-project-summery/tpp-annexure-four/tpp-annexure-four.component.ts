import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../tab-forms/annexure-goods/i18n/en';
import {locale as lngBangla} from '../../tab-forms/annexure-goods/i18n/bn';
import {TappAnnexureIvService} from 'app/main/modules/dpp-tapp-management/services/tapp-annexure/tapp-annexure-iv.service';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {ActivatedRoute} from '@angular/router';
import {environment} from 'environments/environment';
import {TappObjectiveCostService} from "../../../../services/tapp-objective-cost.service";
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
    selector: 'app-tpp-annexure-four',
    templateUrl: './tpp-annexure-four.component.html',
    styleUrls: ['./tpp-annexure-four.component.scss']
})
export class TppAnnexureFourComponent implements OnInit {

    count: number = 0;
    file: any;
    formInformation: any = {
        id: ""
    }
    pcMasterId: number;
    completionDate: any;
    projectTitle: any;
    totalCost: any;
    commencementDate: any;
    conceptUuid = this.route.snapshot.params['id'];
    displayFileName: any;
    backendRootUrl: any;

    spinner: boolean;

    constructor(
        private fb: FormBuilder,
        private tappAnnexureIvService: TappAnnexureIvService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private matSnackBar: SnackbarHelper,
        private pcService: ProjectSummaryService,
        private tappObjectiveCostService: TappObjectiveCostService,
        private dialog: MatDialog,
        private route: ActivatedRoute) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

    }

    ngOnInit(): void {
        this.backendRootUrl = environment.ibcs.ppsDppBackendPoint;
        this.getPcData();
        this.getData();
    }

    /*----Set file information by onchange event----*/
    selectedFile(file: FileList): any {
        this.file = file.item(0);
    }

    /*----Data will be save into database table----*/
    saveMethod(): void {
        let jsonBody = {
            projectConceptUuid: this.route.snapshot.params['id']
        };
        const formData = new FormData();
        formData.append('attachmentFile', this.file);
        formData.append('projectConceptUuid', JSON.stringify(jsonBody));
        this.spinner = true;
        this.tappAnnexureIvService.saveData('create', formData).subscribe((res) => {
            this.matSnackBar.openSuccessSnackBar();
            this.getData();
            this.spinner = false;
        });
    }

    /*----Get Records from database table----*/
    getData() {
        this.tappAnnexureIvService.getData('get-file').subscribe((res) => {
            console.log('res -- ', res);
            this.formInformation = res;
            console.log('environment.ibcs.ppsDppBackendPoint', environment.ibcs.ppsDppBackendPoint);
            this.displayFileName = this.backendRootUrl + "attachment/view/" + res.attachment.fileName;
        });
    }

    /*----Delete Records from database table----*/
    delete(attachmentId) {
        this.spinner = true;
        this.tappAnnexureIvService.deleteFile('delete/' + attachmentId).subscribe((res) => {
            console.log('res -- ', res);
            this.formInformation = res;
            if (res > 0) {
                this.matSnackBar.openSuccessSnackBarWithMessage("File has been deleted!", "Ok");
            }
            this.spinner = false;
        });
    }

    /*----Go back to dashboard----*/
    goBackToHome() {
        window.history.back();
    }

    getPcData() {
        this.pcService.getByUuid(this.conceptUuid).subscribe((res) => {
            this.pcMasterId = res.id;
            this.projectTitle = res.titleEn;
            this.totalCost = res.totalAmount;
            this.commencementDate = res.expCommencementDate;
            this.completionDate = res.expCompletionDate;
            this.getMasterTableData();
        })
    }

    getMasterTableData() {
        this.tappObjectiveCostService.getProjectConceptByUuid(this.conceptUuid).subscribe((response) => {
            this.projectTitle = response.res.projectTitleEn ? response.res.projectTitleEn: this.projectTitle;
            this.commencementDate = response.res.expCommencementDate ? response.res.expCommencementDate: this.commencementDate;
            this.completionDate = response.res.expCompletionDate ? response.res.expCompletionDate: this.completionDate;
        })
    }

    openDeleteDialog(attachmentId) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.DELETE_CONFIRMATION};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(attachmentId);
            }
            dialogRef.close(true);
        });
    }

}
