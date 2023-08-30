import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {environment} from "../../../../../../../environments/environment";
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ApiService} from "../../../../../core/services/api/api.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {StorageService} from "../../../../../core/services/storage/storage.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {addNewIcon, deleteIcon, editIcon, viewIcon} from 'app/main/modules/rpm/constants/button.constants';
import {AwardLatterService} from "../../../services/award-latter.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-award-letter',
    templateUrl: './award-letter.component.html',
    styleUrls: ['./award-letter.component.scss']
})
export class AwardLetterComponent implements OnInit {

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    dataSet = new Array<{
        id: any;
        proposalTitle: any;
        subject: any;
        memorandumNo: any;
        nothiDateEn: any;
        mailStatus:any;
    }>();

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['sl', 'proposalTitle', 'subject', 'nothiDateEn', 'memorandumNo','mailStatus', 'action'];
    dataSource: any;

    baseUrl = environment.ibcs.rpmBackend + 'api/fyw-sector-sub-sector-selection/';

    fiscalYearList = [];
    sectorTypeList = [];
    subSectorTypeListStore = [];
    user: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _latterService: AwardLatterService,
        private _router: Router,
        private storage: StorageService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.user = this.storage.getUserData();
        this.getLatterList();
    }

//Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getLatterList();
    }

    /*---- For open popup dialog box----*/

    private openDialog(id: string) {
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
                this._latterService.deleteLetter(id).subscribe(res => {
                    this.toastr.success(deleteSuccess, "Success" );
                    this.getLatterList();
                }, err => {
                    this.toastr.error(deleteFailed, "Error");
                })
            }
            dialogRef.close(true);
        });
    }

    editRow(id: string) {
        this._router.navigate(['/ti-award-letter/edit/' + id])
    }

    // viewDetails(id: string) {
    //     this._router.navigate(['/letter/view/' + id])
    // }

    tiViewDetails(id: string) {
        this._router.navigate(['ti-award-letter/view/' + id])
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addNew() {
        this._router.navigate(['/ti-award-letter/add'])
    }

    private getLatterList() {
        this.dataSet = [];
        this._latterService.getLetterList(this.page, this.pageSize).subscribe(value => {
            console.log(value)
            value.data.forEach(item => {
                this.dataSet.push({
                    id: item.id,
                    proposalTitle: item.proposalModel.trainingName,
                    subject: item.subject,
                    memorandumNo: item.memorandumNo,
                    nothiDateEn: item.nothiDateEn,
                    mailStatus:item.status
                })

            })
            this.totalElements = this.dataSet.length;
            this.dataSource = new MatTableDataSource(this.dataSet);
        }, error => {

        })
    }
}
