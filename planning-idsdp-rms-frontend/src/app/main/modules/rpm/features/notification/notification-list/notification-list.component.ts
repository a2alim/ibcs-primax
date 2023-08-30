import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DEFAULT_SIZE } from "../../../../../core/constants/constant";
import { environment } from "../../../../../../../environments/environment";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ApiService } from "../../../../../core/services/api/api.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LatterService } from "../../../services/latter.service";
import { Router } from "@angular/router";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { PageEvent } from "@angular/material/paginator";
import { ConfirmDialogConstant } from "../../../../../shared/constant/confirm.dialog.constant";
import { SubmitConfirmationDialogComponent } from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { addNewIcon, deleteIcon, editIcon, noteIcon, viewIcon, deleteSuccess, deleteFailed } from '../../../constants/button.constants';
import { NotificationService } from "../../../services/notification.service";

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    noteIcon = noteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    dataSet = new Array<{
        uuid: any;
        id: any;
        subject: any;
        mailStatus: any;
    }>();

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['sl', 'subject', 'mailStatus', 'action'];
    dataSource: any;

    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';

    fiscalYearList = [];
    sectorTypeList = [];
    subSectorTypeListStore = [];

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _notificationService: NotificationService,
        private _router: Router
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.getLatterList();
    }

    //Pagination Page Change onChangeClick
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
                this._notificationService.deleteNotification(id).subscribe(res => {
                    if (res.success) {
                        this.toastr.success(this.deleteSuccess);
                        this.getLatterList();
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

    editRow(id: string) {
        this._router.navigate(['/notifications/' + id, { actionType: 'edit' }])
    }

    viewDetails(id: string) {
        console.log(id)
        this._router.navigate(['/notifications/' + id, { actionType: 'view' }])
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addNew() {
        this._router.navigate(['/notifications/add/'])
    }

    private getLatterList() {
        this.dataSet = [];
        this._notificationService.getList().subscribe(value => {
            value.items.forEach(item => {
                if (!item.isDeleted) {
                    this.dataSet.push({
                        uuid: item.uuid,
                        id: item.id,
                        subject: item.subject,
                        mailStatus: item.send
                    });
                }
            });
            this.totalElements = this.dataSet.length;
            this.dataSource = new MatTableDataSource(this.dataSet);
        }, error => {

        })
    }

    addNoteDetails(id) {
        this._router.navigate(['/notifications/' + id + '/note'])
    }
}
