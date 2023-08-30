import {Component, OnInit, ViewChild} from '@angular/core';
import {UnsubscribeAdapterComponent} from '../../../../core/helper/unsubscribeAdapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {IModeOfFinance} from '../../models/mode-of-finance';
import {ModeOfFinanceConfigService} from '../../services/mode-of-finance.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
    ERROR,
    FAILED_DELETE,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from '../../../../core/constants/message';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
  selector: 'app-mode-of-finance',
  templateUrl: './mode-of-finance.component.html',
  styleUrls: ['./mode-of-finance.component.scss']
})
export class ModeOfFinanceComponent  extends UnsubscribeAdapterComponent implements OnInit {

    form: FormGroup;
    displayedColumns: string[] = ['sl', 'nameEn', 'nameBn', 'status', 'action'];
    dataSource: MatTableDataSource<IModeOfFinance>;
    total: number;
    disableDelete: boolean;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    actionPermission = [];
    @ViewChild('table') table: MatTable<any>;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ModeOfFinanceConfigService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.populateForm();
        this.getModeOfFinance();
    }

    // For initializing form
    private populateForm() {
        this.form = new FormGroup({
            uuid: new FormControl(''),
            orderId: new FormControl(''),
            nameEn: new FormControl('', [Validators.required]),
            nameBn: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl(true, [Validators.required]),
            editable: new FormControl(false, [Validators.required]),
        });
    }

    // For getting all active date orderBy orderId
    getModeOfFinance() {
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
                this.total = res.totalElements;
            })
        );
    }

    // For calling creat or Update for save
    onSubmit() {
        (this.form.value.uuid) ? this.update() : this.create();
    }

    // For creating Mode Of Finance
    private create() {
        this.subscribe$.add(
            this.service.create(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getModeOfFinance();
                    this.reset();
                }else {
                    this.snackbarHelper.openErrorSnackBar();
                }
            })
        );
    }

    // For updating Mode Of Finance
    private update() {
        this.disableDelete = true;
        this.subscribe$.add(
            this.service.update(this.form.value).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    this.getModeOfFinance();
                    this.reset();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            })
        );
    }

    //  Setting form patch value for update
    edit(row: IModeOfFinance) {
        this.form.patchValue({
            uuid: row.uuid,
            nameEn: row.nameEn,
            orderId: row.orderId,
            nameBn: row.nameBn,
            description: row.description,
            status: row.status,
            editable: row.editable,
        });
    }


    // Change orderId or modify hierarchy
    drop(event: CdkDragDrop<IModeOfFinance>) {
        const previousIndex = this.dataSource.data.findIndex(row => row === event.item.data);
        moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
        this.dataSource.data = this.dataSource.data.slice();

        const modeOfFinanceIds = [];
        this.dataSource.data.forEach((item, j) => {
            modeOfFinanceIds.push(item.id);
        });
        console.log('Mode Finance Ids');
        console.log(modeOfFinanceIds);
        this.service.moveModeFinance(modeOfFinanceIds).subscribe();
    }

    // For deleting Mode of Finance
    delete(row: IModeOfFinance) {
        this.subscribe$.add(
            this.service.delete(row.uuid).subscribe(res => {
                if (res) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                    this.getModeOfFinance();
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_DELETE, ERROR);
                }
            })
        );
    }

    // For searching from list
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    // For calling list during page change
    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getModeOfFinance();
    }

    // For reset form
    reset() {
        this.form.reset();
        this.disableDelete = false;
        this.form.patchValue({
            status: true,
            editable: false
        });
    }

    // For opening confirmation dialog before delete, create and update
    private openDialog(type: 's' | 'u' | 'd', row?: IModeOfFinance) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: (type === 's') ? ConfirmDialogConstant.SAVE_CONFIRMATION :
                (type === 'u') ? ConfirmDialogConstant.UPDATE_CONFIRMATION  : ConfirmDialogConstant.DELETE_CONFIRMATION };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                (type === 's') ? this.create() : (type === 'u') ? this.update() : this.delete(row);
            }
            dialogRef.close(true);
        });
    }

}
