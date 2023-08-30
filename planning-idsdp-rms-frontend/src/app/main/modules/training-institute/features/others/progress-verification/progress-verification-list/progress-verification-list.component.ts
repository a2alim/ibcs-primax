import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ConfigurationService} from "../../../../../settings/services/configuration.service";
import {locale as lngEnglish} from "../../progress-verification/i18n/en";
import {locale as lngBangla} from "../../progress-verification/i18n/bn";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {PageEvent} from "@angular/material/paginator";
import {addNewIcon} from 'app/main/modules/training-institute/constants/button.constants';
import {emailIcon, pdfIcon, uploadIcon, viewIcon} from 'app/main/modules/rpm/constants/button.constants';
import {ProgressVerificationService} from "../../../../services/progress-verification.service";
import {ProgressVerificationModel} from "../../../../models/progress-verification.model";
import {  deleteFailed, deleteSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-progress-verification-list',
    templateUrl: './progress-verification-list.component.html',
    styleUrls: ['./progress-verification-list.component.scss']
})
export class ProgressVerificationListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'nameOfInstitute', 'titleOfResearch', 'verificationDate', 'action'];
    dataSource: MatTableDataSource<ProgressVerificationModel>;
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    viewIcon = viewIcon;
    uploadIcon = uploadIcon;


    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;

    fiscalYears: any [] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: Router,
                private dialog: MatDialog,
                private _toastService: ToastrService,
                private _configurationService: ConfigurationService,
                private _progressVerificationService: ProgressVerificationService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.spinner = true;

        this.getFiscalYears();
        this.getProgressVerificationList();
    }

    openDialog(progressVerificationId: number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.deleteProgressVerification(progressVerificationId);
            }
            dialogRef.close(true);
        });
    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    viewDetails(id: number) {
        this.route.navigate(['progress-verification/view/' + id]);
    }

    edit(id: number) {
        this.route.navigate(['progress-verification/edit/' + id]);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }

        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    private getFiscalYears() {
        // this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
        this._configurationService.getFiscalYearList().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }

    private getProgressVerificationList() {
        this._progressVerificationService.getProgressVerificationList(this.page, this.size).subscribe(
            res => {
                this._configurationService.getFiscalYearList().toPromise().then(
                    res2 => {
                        this.fiscalYears = res2.items;

                        let data: any[] = res.data;

                        console.log(this.fiscalYears)

                        for (let i = 0; i < data.length; i++) {
                            data[i].fiscalYear = this.getFiscalYearName(data[i].fiscalYearId);
                        }

                        this.dataSource = new MatTableDataSource(data);
                        this.total = res.totalItems;
                        this.spinner = false;
                        console.log(data)
                    },
                    error => {
                        console.log(error)
                    }
                )


            },
            error => {
                this.spinner = false;
                console.log(error)
            }
        )
    }

    private deleteProgressVerification(progressVerificationId: number) {
        this._progressVerificationService.deleteProgressVerification(progressVerificationId).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getProgressVerificationList();
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log(error)
            }
        )
    }
}
