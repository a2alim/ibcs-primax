import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {SubSectorModel} from '../../models/sub-sector.model';
import {SubSectorService} from '../../services/sub-sector.service';
import {SectorModel} from '../../models/sector.model';
import {SectorService} from '../../services/sector.service';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
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
  selector: 'app-sub-sector',
  templateUrl: './sub-sector.component.html',
  styleUrls: ['./sub-sector.component.scss']
})
export class SubSectorComponent implements OnInit {

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    model: SubSectorModel = new SubSectorModel();
    subSectorList: SubSectorModel[] = new Array<SubSectorModel>();
    sectorList: SectorModel[] = new Array<SectorModel>();
    disableDelete: boolean;
    formGroup: FormGroup;
    displayedColumns: string[] = ['sl', 'subSectorNameEn', 'subSectorNameBn', 'subSectorCode', 'status', 'action'];
    dataSource: MatTableDataSource<SubSectorModel>;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog,
        private subSectorService: SubSectorService,
        private sectorService: SectorService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    //For form initial
    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getSubSector();
        this.getSector();
        this.dataSource = new MatTableDataSource(this.subSectorList);
        this.formGroup = this.formBuilder.group({
            uuid: ['', ''],
            subSectorCode: ['', Validators.required],
            subSectorNameEn: ['', Validators.required],
            subSectorNameBn: ['', Validators.required],
            sectorId: ['', Validators.required],
            description: ['', ''],
            status: [true, Validators.required],
        });
    }

    //For form submit for create or update
    onSubmit() {
        (this.formGroup.value.uuid) ? this.update() : this.create();
    }

    //For create sub sector
    private create() {
        this.subSectorService.create(this.formGroup.value).subscribe(res => {
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getSubSector();
                this.getSector();
            } else {
                this.snackbarHelper.openErrorSnackBar();
            }
        })
    }

    //For set form value in edit button click
    edit(row: SubSectorModel) {
        this.disableDelete = true;
        this.formGroup.patchValue({
            uuid: row.uuid,
            subSectorCode: row.subSectorCode,
            subSectorNameEn: row.subSectorNameEn,
            subSectorNameBn: row.subSectorNameBn,
            sectorId: row.sectorId,
            description: row.description,
            status: row.status,
        });
    }

    //For update sub sector
    private update() {
        this.subSectorService.update(this.formGroup.value).subscribe(res => {
            if (res.uuid) {
                this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                this.resetValue();
                this.getSubSector();
                this.getSector();
            } else {
                this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
            }
        })
    }

    //For delete subsector
    delete(row: SubSectorModel) {
        this.subSectorService.delete(row.uuid).subscribe(res => {
            if (res) {
                 this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, 'OK');
                this.getSubSector();
            } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
            }
        })
    }

    //For get sub sector
    getSubSector() {
        this.sectorList = [];
        this.subSectorService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
        });
    }

    //For table view
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

    //For reset form
    resetValue(): any {
        this.formGroup.reset();
        this.disableDelete = false;
        this.formGroup.patchValue({
            status: true
        });
    }

    //For table pagination
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getSubSector();
    }

    //For get sector
    getSector() {
        this.sectorList = [];
        this.sectorService.getActiveSector().subscribe(res => {
            res.forEach(m => {
                this.sectorList.push(m);

            });
        });
        console.log(this.sectorList);
    }

    //For open dialog
    private openDialog(row: SubSectorModel) {
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
