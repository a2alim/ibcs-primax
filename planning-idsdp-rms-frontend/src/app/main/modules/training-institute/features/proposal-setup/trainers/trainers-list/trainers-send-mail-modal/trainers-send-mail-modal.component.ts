import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {LinkupProposalWithEvaluatorsModel} from "../../../../../../rpm/models/LinkupProposalWithEvaluatorsModel";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {LinkupProposalWithEvaluatorsService} from "../../../../../../rpm/services/linkup-proposal-with-evaluators.service";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "../../../../../../training-institute/features/proposal-setup/trainers/i18n/en";
import {locale as lngBangla} from "../../../../../../training-institute/features/proposal-setup/trainers/i18n/bn";
import {ConfirmDialogConstant} from "../../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {closeIcon, previousIcon, saveIcon, sendIcon} from 'app/main/modules/training-institute/constants/button.constants';
import {ToastrService} from "ngx-toastr";
import {ConfigurationService} from "../../../../../../settings/services/configuration.service";

@Component({
    selector: 'app-trainers-send-mail-maodal',
    templateUrl: './trainers-send-mail-modal.component.html',
    styleUrls: ['./trainers-send-mail-modal.component.scss']
})
export class TrainersSendMailModalComponent implements OnInit {


    closeEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    linkupProposalWithEvaluatorsObj: LinkupProposalWithEvaluatorsModel = new LinkupProposalWithEvaluatorsModel();


    saveIcon = saveIcon;
    previousIcon = previousIcon;
    sendIcon = sendIcon;
    closeIcon = closeIcon;
    update: boolean;
    spinner = false;
    viewFlag: boolean;
    toolbar = {toolbar: [[]]};
    fiscalYears: any[];
    selectedFiscalYear: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) data: LinkupProposalWithEvaluatorsModel,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _linkupProposalWithEvaluatorsService: LinkupProposalWithEvaluatorsService,
        private _snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private _toastService: ToastrService,
        private _configurationService: ConfigurationService
    ) {
        this.linkupProposalWithEvaluatorsObj = data;
        this.viewFlag = this.linkupProposalWithEvaluatorsObj.viewFlag;
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getFiscalYears();
    }

    onSubmit(send: boolean) {
        this.openDialog(send);
    }

    onClose(value: boolean) {
        this.dialog.closeAll();
    };

    changeFiscalYear() {

    }

    private openDialog(send: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '40%';
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: 'Are you sure you want to send this letter?'};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this._toastService.success("Mail Sent", "Success")
                this.onClose(true)
            }
            dialogRef.close(true);
        });
    }

    private getFiscalYears() {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }
}
