import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { addNewIcon, deleteIcon, editIcon, viewIcon } from '../../constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { UploadFileModalsComponent } from "./upload-file-modal/upload-file-modals.component";
import { ResearchCancellationServiceService } from "../../services/research-cancellation-service.service";
import { StorageService } from "app/main/core/services/storage/storage.service";
import { ResearchCancellationStatus } from '../../enums/enum-list.enum';

@Component({
    selector: 'app-research-cancellation',
    templateUrl: './research-cancellation.component.html',
    styleUrls: ['./research-cancellation.component.scss']
})
export class ResearchCancellationComponent implements OnInit {

    displayedColumns: string[] = ['position', 'researcherProposalInfoId', 'actionFor', 'fiscalYear', 'status', 'action'];
    dataSource: any;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    fiscalYearListFull: any[] = [];
    /*----Button---*/

    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;

    loginUserInfo: any;
    public researchStatus = ResearchCancellationStatus;

    /*----/Button---*/
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _dialog: MatDialog,
        private _route: Router,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private dataCom: DataComService,
        private router: Router,
        private researchAction: ResearchCancellationServiceService,
        private StorageService: StorageService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.loginUserInfo = this.StorageService.getUserData();
        this.getListData();
    }

    researchCancellationUpload(element) {
        this.researchAction.data = element.id;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '85%';
        dialogConfig.height = '85%';
        dialogConfig.data = { ...element };
        const dialogRef = this._dialog.open(UploadFileModalsComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }

    add() {
        this.dataCom.setPassedItemData(false);
        this.researchAction.data = null;
        this.router.navigate(['/research-cancellation-add']);
    }

    editRow(row) {
        this.researchAction.data = row;
        this.router.navigate([`/research-cancellation/${row.uuid}/edit`]);
    }


    viewDetails(row) {
        this.researchAction.data = row;
        this.router.navigate([`/research-cancellation/${row.uuid}/view`]);
    }

    getListData() {
        this.researchAction.getResearchCancellationList(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private openDialog(rowUuid) {
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
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(rowUuid) {
        this.researchAction.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            }
            else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }


    openDialogForStatus(row: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.STATUS };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.onUpdateStatus(row);
            } else {
                this.getListData();
            }
            dialogRef.close(true);

        });
    }

    onUpdateStatus(row: any) {
        let data = {
            uuid: row.uuid,
            id: row.id,
            researcherProposalInfoId: row.researcherProposalInfoId,
            formula: row.formula,
            actionFor: row.actionFor,
            newResearchStartDate: row.newResearchStartDate,
            newResearchEndDate: row.newResearchEndDate,
            newResearchDurationMonth: row.newResearchDurationMonth,
            newTotalGrantAmount: row.newTotalGrantAmount,
            subject: row.subject,
            details: row.details,
            status: row.status
        }

        this.researchAction.update(data).subscribe(
            res => {
                if (res.success) {
                    this.toastr.success(res.message, "", this.config);
                    this.router.navigate(['/research-cancellation']);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            },
            err => {
                this.toastr.error('Http Error Occurred !', "", this.config);
            }
        )
    }

}
