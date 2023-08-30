import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {ProcurementTypeModel} from '../../models/procurement-type.model';
import {ProcurementTypeService} from '../../services/procurement-type.service';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {MunicipalityModel} from '../../models/municipality.model';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../core/constants/message";


@Component({
    selector: 'app-procurement-type',
    templateUrl: './procurement-type.component.html',
    styleUrls: ['./procurement-type.component.scss']
})
export class ProcurementTypeComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    disableDelete: boolean;
    model: ProcurementTypeModel = new ProcurementTypeModel();
    procurementTypeList: ProcurementTypeModel[] = new Array<ProcurementTypeModel>();
    displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'action'];
    dataSource = new MatTableDataSource(this.procurementTypeList);

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private procurementTypeService: ProcurementTypeService,
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    /*
   * when procurement type component is initialize ngOnInit method firstly load
   */

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
        this.getProcurementType();
    }
    /*
    create Procurement Type
    */
    create() {
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        if (this.frmGroup.value.nameBangla != null && this.frmGroup.value.nameEnglish && this.frmGroup.value.status) {
            this.procurementTypeService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.disableDelete = false;
                this.resetValue();
                this.getProcurementType();
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }
    /*
     edit Procurement Type
    */
    edit(uuid: string) {
        this.disableDelete = true;
        this.editValue = true;
        console.log(uuid);
        this.procurementTypeService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }
    /*
     update Procurement Type
     */
    update() {
        console.log(this.uuid);
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.procurementTypeService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.editValue = false;
            this.disableDelete = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getProcurementType();
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }
    /*
    delete Procurement Type
    */
    delete(uuid: string) {
        this.procurementTypeService.delete(uuid).subscribe(res => {
            this.getProcurementType();
        });
    }

    /*
     Get list Procurement Type
    */

    getProcurementType() {
        this.procurementTypeList = [];
        this.procurementTypeService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.procurementTypeList.push(m);
            // });
        });
    }
    /*
     set form value Procurement Type
     */
    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            nameBangla: [res.nameBn],
            nameEnglish: [res.nameEn],
            description: [res.description],
            status: [res.status.toString()],
        });
    }


    /*
     reset form value Procurement Type
    */

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /*
    search data by filter
     */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getProcurementType();
    }


    /*
     reset form value Procurement Type
     */
    reset() {
        this.resetValue();
        this.editValue = false;
        this.disableDelete = false;
    }

    /*
      Open Dialog
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
