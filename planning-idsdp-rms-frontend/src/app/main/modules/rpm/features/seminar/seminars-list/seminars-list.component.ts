import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DEFAULT_SIZE } from "../../../../../core/constants/constant";
import { environment } from "../../../../../../../environments/environment";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ApiService } from "../../../../../core/services/api/api.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { PageEvent } from "@angular/material/paginator";
import { ConfirmDialogConstant } from "../../../../../shared/constant/confirm.dialog.constant";
import { SubmitConfirmationDialogComponent } from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import {
    addNewIcon,
    deleteIcon,
    editIcon,
    noteIcon,
    sendIcon,
    viewIcon,
    deleteSuccess,
    deleteFailed,
    playIcon
} from '../../../constants/button.constants';
import { SeminarService } from "../../../services/seminar.service";
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ERROR } from 'app/main/core/constants/message';
import { PresentationReportService } from '../../../services/presentation-report.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-seminars-list',
    templateUrl: './seminars-list.component.html',
    styleUrls: ['./seminars-list.component.scss']
})
export class SeminarsListComponent implements OnInit {
    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    sendIcon = sendIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    playIcon = playIcon;
    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit
    dataSet = new Array<{
        uuid: any;
        id: any;
        seminarNo: any;
        subject: any;
        seminarDate: any;
        mailSent: boolean;
    }>();
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    //TODO: This is number of column for Mat Table
   // displayedColumns: string[] = ['sl', 'seminars_no', 'subject', 'presentation', 'action'];
    displayedColumns: string[] = ['sl', 'subject', 'seminarDate', 'presentation', 'action'];
    dataSource: any;
    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';
    fiscalYearList = [];
    sectorTypeList = [];
    subSectorTypeListStore = [];
    loginUserInfo: any;

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _seminarService: SeminarService,
        private _router: Router,
        private snackbarHelper: SnackbarHelper,
        private presentationReportService: PresentationReportService,
        private storageService: StorageService,
        private _date: DatePipe,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.loginUserInfo = this.storageService.getUserData();
        if (localStorage.getItem("seminarId")) {
            localStorage.removeItem("seminarId");
        }
        this.spinner = true;
        this.getSeminarList();
    }
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }
    /*---- For open popup dialog box----*/
    private openDialog(id: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this._seminarService.deleteSeminar(id).subscribe(res => {
                    if (res.success) {
                        this.toastr.success(this.deleteSuccess);
                        this.getSeminarList();
                    } else {
                        this.toastr.error(this.deleteFailed);
                    }
                }, err => {
                    this.toastr.error("Something went wrong!");
                })
            }
            dialogRef.close(true);
        });
    }
    editRow(uuid: string, id: number) {
        this._router.navigate(['seminars/' + uuid + '/edit/' + id])
    }
    viewDetails(id: string, uuid: string) {
        this._router.navigate(['seminars/' + uuid + '/view/' + id])
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    addNew() {
        this._router.navigate(['/seminars/add/'])
    }
    private getSeminarList() {
        this.dataSet = [];
        this._seminarService.getSeminarList(this.page, this.pageSize).subscribe(
            value => {
                value.page.content.forEach(item => {
                    this.dataSet.push({
                        uuid: item.uuid,
                        id: item.id,
                        seminarNo: item.seminarNo,
                        subject: item.subject,
                        seminarDate: this._date.transform(item.seminarDate, 'dd/MM/yyyy'),
                        mailSent: item.mailSent

                    });
                });
                this.totalElements = this.dataSet.length;
                this.dataSource = new MatTableDataSource(this.dataSet);
            },
            error => {
            });
    }
    sentEmail(id, uuid) {
        this._router.navigate(['/seminars/' + uuid + '/email/' + id]);
    }
    goToPresentation(data) {
        this._seminarService.seminarIsExists(data.id).subscribe(
            response => {
                if (response) {
                    this._router.navigate(['add-researcher-presentation/' + data.uuid]);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage('Seminar time schedule not created yet !.', ERROR);
                }
            },
            error => {
                this.snackbarHelper.openErrorSnackBarWithMessage('HTTP Error occeared !.', ERROR);
            }
        );
    }
    goToCreateReport(data) {
        this._router.navigate(['seminars-predefined-template-for-presentation/' + data.uuid]);
    }
    viewPresentation(data) {
        this.presentationReportService.seminarIsExists(data.id).subscribe(
            response => {
                if (response) {
                    this._router.navigate(['presentation-report/' + data.uuid]);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage('Presentation Report not created yet !.', ERROR);
                }
            },
            error => {
                this.snackbarHelper.openErrorSnackBarWithMessage('HTTP Error occeared !.', ERROR);
            }
        );
    }
}
