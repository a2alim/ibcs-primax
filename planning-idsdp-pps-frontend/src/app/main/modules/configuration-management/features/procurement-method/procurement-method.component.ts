import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {ProcurementMethodService} from '../../services/procurement-method.service';
import {ProcurementMethodModel} from '../../models/procurement-method.model';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {log} from "util";
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";

@Component({
  selector: 'app-procurement-method',
  templateUrl: './procurement-method.component.html',
  styleUrls: ['./procurement-method.component.scss']
})
export class ProcurementMethodComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;

    procurementMethodFor = new FormControl();
    disableDelete: boolean;
    model: ProcurementMethodModel = new ProcurementMethodModel();
    procurementMethodList: ProcurementMethodModel[] = new Array<ProcurementMethodModel>();
    displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'action'];
    dataSource = new MatTableDataSource(this.procurementMethodList);

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private procurementMethodService: ProcurementMethodService,
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    /*
    * when procurement method component is initialize ngOnInit method firstly load
    */

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            procurementMethodFor: [''],
            description: ['', ''],
            status: ['true', Validators.required],
        });
        this.getProcurementMethod();
    }

    /*
    Create for procurement method
    */
    onSubmit() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;

        if (this.procurementMethodFor.value == null || this.procurementMethodFor.value.length === 0) {

        } else {
            let value = '';
            const len = this.procurementMethodFor.value.length;
            for (let i = 0; i < len; i++) {
                value += this.procurementMethodFor.value[i] + ':';
            }
            value = value.substring(0, value.length - 1);
            this.model.procurementMethodFor = value;
            this.model.status = this.frmGroup.value.status;

            console.log(value);
            if (this.model.nameBn && this.model.nameEn && this.model.status) {
                this.procurementMethodService.create(this.model).subscribe(res => {
                    // this.procurementMethodFor.setValue('');
                    this.resetValue();
                    this.reset();
                    this.snackbarHelper.openSuccessSnackBar();

                    this.getProcurementMethod();
                }, error => {
                    this.snackbarHelper.openErrorSnackBar();
                });
            }
        }


    }

    /*
    edit for procurement method
    */

    edit(uuid: string) {
        this.disableDelete = true;
        this.editValue = true;
        console.log(uuid);
        this.procurementMethodService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }


    /*
    update for procurement method
    */

    update() {
        this.disableDelete = false;
        console.log(this.uuid);
        this.model.uuid = this.uuid;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        if (this.procurementMethodFor.value == null || this.procurementMethodFor.value.length === 0) {

        } else {
            let value = '';
            const len = this.procurementMethodFor.value.length;
            for (let i = 0; i < len; i++) {
                value += this.procurementMethodFor.value[i] + ':';
            }
            value = value.substring(0, value.length - 1);
            this.model.procurementMethodFor = value;


            console.log(value);
            if (this.model.nameBn && this.model.nameEn && this.model.status) {
                this.procurementMethodService.update(this.model).subscribe(res => {

                    this.resetValue();
                    this.reset();
                    // this.procurementMethodFor.setValue('');
                    this.snackbarHelper.openSuccessSnackBarWithMessage("Data Update Successfully", "Ok");
                    this.editValue = false;
                    this.uuid = '';
                    this.model.uuid = '';
                    this.getProcurementMethod();
                }, error => {
                    this.snackbarHelper.openErrorSnackBar();
                });
            }
        }

    }
    /*
     delete for procurement method
     */
    delete(uuid: string) {
        this.procurementMethodService.delete(uuid).subscribe(res => {
            this.getProcurementMethod();
        });
    }



    /*
     get Procurement Method
     */
    getProcurementMethod() {
        this.procurementMethodList = [];
        this.procurementMethodService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.procurementMethodList.push(m);
            // });
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /*
     search Procurement Method
     */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*
     set form value Procurement Method
     */

    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            nameBangla: [res.nameBn],
            nameEnglish: [res.nameEn],
            description: [res.description],
            status: [res.status.toString()],
        });
        console.log('--------');

        this.procurementMethodFor.setValue(res.procurementMethodFor.split(':'));
    }


    /*
     reset form value Procurement Method
     */

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }

    /*
    change value form ProcurementMethod
    */

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getProcurementMethod();
    }

    /*
    reset form value Procurement Method
    */

    reset() {
        this.resetValue();
        this.procurementMethodFor.setValue('');
        this.disableDelete = false;
        this.editValue = false;
    }

    /*
    open dialog for delete procurement method
    */

    private openDialog(uuid: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(uuid);
            }
            dialogRef.close(true);
        });
    }
}
