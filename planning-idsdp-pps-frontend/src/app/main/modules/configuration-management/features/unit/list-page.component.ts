import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UnitTypeService} from '../../services/unit-type.service';
import {UnitTypeModel} from '../../models/unit-type.model';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";
import {OK, SUCCESSFULLY_UPDATED} from "../../../../core/constants/message";


@Component({
    selector: 'app-list-page',
    templateUrl: './list-page.component.html',
    styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent implements OnInit {

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;

    model: UnitTypeModel = new UnitTypeModel();
    unitTypeList: UnitTypeModel[] = new Array<UnitTypeModel>();

    /* ----- header of Mat-table -----*/
    displayedColumns: string[] = ['id', 'unitTypeNameEng', 'unitTypeNameBng', 'status', 'action'];
    dataSource = new MatTableDataSource(this.unitTypeList);
    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private formBuilder: FormBuilder,
        private UnitTypeService: UnitTypeService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.frmGroup = new FormGroup({
            unitTypeNameEng: new FormControl('', Validators.required),
            unitTypeNameBng: new FormControl(''),
            description: new FormControl(''),
            status: new FormControl(true, Validators.required),
        });
        this.getListData();
    }

    /* ---- Form submit method ----  */
    onSubmit() {
        if (this.frmGroup.valid) {
            this.saveData();
        } else {
            this.matSnackBar.openErrorSnackBar();
        }
    }

    /* ---- If validation is true then trigger this function ----  */
    saveData() {
        this.model.unitTypeNameEng = this.frmGroup.value.unitTypeNameEng;
        this.model.unitTypeNameBng = this.frmGroup.value.unitTypeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        if (this.frmGroup.value.unitTypeNameEng != null) {
            this.UnitTypeService.create(this.model).subscribe(res => {
                this.matSnackBar.openSuccessSnackBar();
                this.resetValue();
                this.getListData();
            });
        }
    }

    /*---- For edit unit type records----*/
    edit(uuid: string) {
        this.editValue = true;
        this.UnitTypeService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }

    /*---- For update unit type records----*/
    update() {
        this.model.unitTypeNameEng = this.frmGroup.value.unitTypeNameEng;
        this.model.unitTypeNameBng = this.frmGroup.value.unitTypeNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.UnitTypeService.update(this.model).subscribe(res => {
            this.matSnackBar.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.resetValue();
            this.getListData();
        });
    }

    /*---- For open popup dialog box----*/
    private openDialog(rowUuid) {
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
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(rowUuid) {
        this.UnitTypeService.delete(rowUuid).subscribe(res => {
            this.matSnackBar.openSuccessSnackBarWithMessage("Deleted Successfully", "Ok")
            this.getListData();
        });
    }

    /*----------------Set value in form fields---------------*/
    setValue(res: any) {
        this.frmGroup = this.formBuilder.group({
            unitTypeNameEng: [res.unitTypeNameEng],
            unitTypeNameBng: [res.unitTypeNameBng],
            description: [res.description],
            status: [res.status.toString()],
        });
    }

    /*----------------/Set value in form fields---------------*/

    /*----------------Reset Form Fields---------------*/
    resetValue() {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            status: true
        });
    }

    /*----------------/Reset Form Fields---------------*/

    /*----------------Mat-Table---------------*/
    getListData() {
        this.unitTypeList = [];
        this.UnitTypeService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({
                ...m,
                currentStatus: m.status ? 'Active' : 'Inactive'
            })));
            this.total = res.totalElements;
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

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
        this.getListData();
    }

    /*----------------/Mat-Table---------------*/

}
