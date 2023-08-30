import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {locale as lngEnglish} from "../../progress-report/i18n/en";
import {locale as lngBangla} from "../../progress-report/i18n/bn";
import {Subscription} from "rxjs";
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {addNewIcon, deleteIcon, editIcon, refreshIcon, viewIcon, previousIcon} from '../../../constants/button.constants';
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {ToastrService} from "ngx-toastr";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";
import {SubmitProgressReportServiceService} from "../../../services/submit-progress-report-service.service";
import {MatTableDataSource} from "@angular/material/table";
import {StorageService} from "../../../../../core/services/storage/storage.service";


@Component({
  selector: 'app-progress-report-list',
  templateUrl: './progress-report-list.component.html',
  styleUrls: ['./progress-report-list.component.scss']
})
export class ProgressReportListComponent implements OnInit {
    @ViewChild('inputForm') inputForm: NgForm;

    /*----Button---*/
    editIcon = editIcon;
    deleteIcon = deleteIcon;
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    refreshIcon = refreshIcon;
    previousIcon = previousIcon;

    /*----/Button---*/
    subscription: Subscription;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = 'Save'; //Edit

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    dataSource: any;
    userDetails: any;
    baseUrl: any;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'researchTitle', 'category', 'fiscalYear', 'researchCompleted','action'];


    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private route: Router,
        private toastr: ToastrService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private _submitProgressRepost: SubmitProgressReportServiceService,
        private storageService: StorageService,
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

  ngOnInit(): void {
      this.baseUrl = this._submitProgressRepost.minioEndPointHost;
      this.userDetails = this.storageService.getUserData();
      this.getListData();
  }

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

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
    }

    getListData() {
        this._submitProgressRepost.getSubmitProgressList(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content ? res.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
    }

    delete(rowUuid) {
        this._submitProgressRepost.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "", this.config);
                this.getListData();
            }
            else {
                this.toastr.warning(res.message, "", this.config);
            }
        });
    }

    public createPage(){
        this._submitProgressRepost.mode = 'Save';
        this.route.navigate(['progress-report/add']).then(r => console.log(r));
    }

    edit(element){
        this._submitProgressRepost.data = element
        this._submitProgressRepost.mode = 'Edit';
        this.route.navigate([`progress-report/add/${element.uuid}/edit`]).then(r => console.log(r));
    }

    view(element){
        this._submitProgressRepost.element = element
        this.route.navigate([`progress-report/${element.uuid}/details`]).then(r => console.log(r));
    }
}
