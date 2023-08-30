import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
    deleteSuccess,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveFailed,
    saveIcon,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';

import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { DateAdapter } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../auth/services/auth.service";
import { CompletionReportModel } from "../../../../models/completion-report.model";
import { CompletionReportService } from "../../../../services/completion-report.service";
import { MEDIUM_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';

@Component({
    selector: 'app-add-completion-report',
    templateUrl: './add-completion-report.component.html',
    styleUrls: ['./add-completion-report.component.scss']
})
export class AddCompletionReportComponent implements OnInit {

    //Icon
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    //Toast Config
    config: { timeOut: 8000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    //Variable
    completionReport: CompletionReportModel = new CompletionReportModel();

    isUpdatedAction: boolean;
    isEditable: boolean = false;
    tempProposalId: string;
    proposalId: number;
    tempCompletionReportId: string;
    completionReportId: number;

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;

    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;



    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dateAdapter: DateAdapter<Date>,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private route: Router,
        private _completionReportService: CompletionReportService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

        this.tempProposalId = this._activatedRoute.snapshot.params['proposalId'];
        if (this.tempProposalId) {
            this.proposalId = parseInt(this.tempProposalId);
            this.isEditable = false;
        }

        this.tempCompletionReportId = this._activatedRoute.snapshot.params['id'];
        if (this.tempCompletionReportId) {
            this.completionReportId = parseInt(this.tempCompletionReportId);
            this.isEditable = true;
        }
    }

    ngOnInit(): void {
        if (this.isEditable) {
            this.getCompletionReport();
        }
    }


    formReset() {
        this.completionReport = new CompletionReportModel();
    }

    save() {
        if (this.isEditable) {
            this.onUpdate();
        } else {
            this.onSave();
        }
    }

    onSave() {
        this.completionReport.proposalId = this.proposalId;
        this.spinner = true;
        this._completionReportService.save(this.completionReport).subscribe(
            (response) => {
                this._toastrService.success(this.saveSuccess, 'Success');
                this.route.navigate(['completion-reports']);
                this.spinner = false;
            },
            (error) => {
                this._toastrService.error(this.saveFailed, 'Error');
                this.spinner = false;
            }
        )
    }

    onUpdate() {
        this.spinner = true;
        this._completionReportService.update(this.completionReport, this.completionReportId).subscribe(
            (response) => {
                this._toastrService.success(this.updateSuccess, 'Success');
                this.route.navigate(['completion-reports']);
                this.spinner = false;
            },
            (error) => {
                this._toastrService.error(this.updateFailed, 'Error');
                this.spinner = false;
            }
        )
    }

    saveFinal() {
        this.completionReport.isFinalSubmitted = true;
        this.save();
    }

    private getCompletionReport() {
        this.spinner1 = true;
        this._completionReportService.getReport(this.completionReportId).subscribe(
            (data: CompletionReportModel) => {
                this.completionReport = data;
                this.completionReport.proposalId = data.proposalModel.id;
                this.spinner1 = false;
            },
            (error) => {
                this._toastrService.error(this.dataNotFount, 'Error');
                this.spinner1 = false;
            }
        )
    }
}
