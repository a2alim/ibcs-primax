import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {SectorDivisionModel} from '../../models/sector-division.model';
import {SectorDivisionService} from '../../services/sector-division.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {
    ERROR,
    FAILED_DELETE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from '../../../../core/constants/message';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
  selector: 'app-sector-division',
  templateUrl: './sector-division.component.html',
  styleUrls: ['./sector-division.component.scss']
})
export class SectorDivisionComponent implements OnInit {

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    model: SectorDivisionModel = new SectorDivisionModel();
    sectorDivisionList: SectorDivisionModel[] = new Array<SectorDivisionModel>();
    disableDelete: boolean;
    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'sectorDivisionNameEn', 'sectorDivisionNameBn', 'sectorDivisionCode', 'status', 'action'];
    dataSource: MatTableDataSource<SectorDivisionModel>;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private sectorDivisionService: SectorDivisionService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    //For form initial
    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getSectorDivision();
        this.dataSource = new MatTableDataSource(this.sectorDivisionList);
        this.formGroup = this.formBuilder.group({
            uuid: ['', ''],
            sectorDivisionCode: ['', Validators.required],
            sectorDivisionNameEn: ['', Validators.required],
            sectorDivisionNameBn: ['', Validators.required],
            description: ['', ''],
            status: [true, Validators.required],
        });
    }

    //For form submit for create or update
    onSubmit() {
        (this.formGroup.value.uuid) ? this.update() : this.create();
    }

    //For create sector division
    private create() {
            this.sectorDivisionService.create(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.resetValue();
                    this.getSectorDivision();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
    }

    //For set form value in edit mode selected
    edit(row: SectorDivisionModel) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            sectorDivisionCode: row.sectorDivisionCode,
            sectorDivisionNameEn: row.sectorDivisionNameEn,
            sectorDivisionNameBn: row.sectorDivisionNameBn,
            description: row.description,
            status: row.status,
        });
    }

    //For update sector division
    private update() {
            this.sectorDivisionService.update(this.formGroup.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.resetValue();
                    this.getSectorDivision();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
    }

    //For delete sector division
    delete(row: SectorDivisionModel) {
        this.sectorDivisionService.delete(row.uuid).subscribe(res => {
            if (res) {
                 this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, 'OK');
                this.getSectorDivision();
            } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
        })
    }

    //For get sector division
    getSectorDivision() {
        this.sectorDivisionList = [];
        this.sectorDivisionService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
        });
    }

    //For table list view init
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    //For table search filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    //For form reset
    resetValue(): any {
        this.formGroup.reset();
        this.disableDelete = false;
        this.formGroup.patchValue({
            status: true
        });
    }

    //For change page in table pagination select
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getSectorDivision();
    }

    //For open dialog
    private openDialog(row: SectorDivisionModel) {
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
                this.delete(row);
            }
            dialogRef.close(true);

        });
    }

}
