import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {UpazillaModel} from '../../models/upazilla.model';
import {UpazillaService} from '../../services/upazilla.service';
import {ZillaModel} from '../../models/zilla.model';
import {ZillaService} from '../../services/zilla.service';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";


@Component({
  selector: 'app-upazilla',
  templateUrl: './upazilla.component.html',
  styleUrls: ['./upazilla.component.scss']
})
export class UpazillaComponent implements OnInit {

    model: UpazillaModel = new UpazillaModel();
    upazillaList: UpazillaModel[] = new Array<UpazillaModel>();
    zillaList: ZillaModel[] = new Array<ZillaModel>();
    editValue: boolean;
    disableDelete: boolean;
    frmGroup: FormGroup;
    uuid: string;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    displayedColumns: string[] = ['uuid', 'nameEn', 'nameBn', 'geoCode', 'zilla', 'status', 'action'];
    dataSource = new MatTableDataSource(this.upazillaList);
    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private upazillaService: UpazillaService,
        private zillaService: ZillaService,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.dataSource = new MatTableDataSource(this.upazillaList);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.resetValue();
        this.getZilla();
        this.getUpazilla();
    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            zillaId: ['', Validators.required],
            geoCode: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }
    getZilla() {
        this.zillaList = [];
        this.zillaService.getList().subscribe(res => {
            res.forEach(m => {
                this.zillaList.push(m);

            });
        });
        console.log(this.zillaList);
    }

    create() {
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.zillaId = this.frmGroup.value.zillaId;
        this.model.status = this.frmGroup.value.status;
        if (this.model.nameBn && this.model.nameEn && this.model.status) {
            this.upazillaService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getUpazilla();
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }

    reset() {
        this.resetValue();
        this.disableDelete = false;
        this.editValue = false;
    }

    edit(row: UpazillaModel) {
        console.log(row);
        this.editValue = true;
        this.uuid = row.uuid;
        this.frmGroup.patchValue({
            uuid: row.uuid,
            geoCode: row.geoCode,
            nameEnglish: row.nameEn,
            nameBangla: row.nameBn,
            zillaId: this.findZillaName(row.zillaId),
            description: row.description,
            status: row.status.toString(),
        });
    }
    findZillaName(res: any) {
        for( let i = 0; i < this.zillaList.length; i++) {
            if (res == this.zillaList[i].id) {
                const name = this.zillaList[i].id;
                return name;
            }
        }
    }
    update() {
        this.model.uuid = this.uuid;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.zillaId = this.frmGroup.value.zillaId;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        this.upazillaService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBar();
            this.resetValue();
            this.getUpazilla();
            this.editValue = false;
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    delete(uuid: string) {
        this.upazillaService.delete(uuid).subscribe(res => {
            this.getUpazilla();
        });
    }


    getUpazilla() {
        this.upazillaList = [];
        this.upazillaService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
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
        this.getUpazilla();
    }

    private openDialog(uuid: string) {
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
                this.delete(uuid);
            }
            dialogRef.close(true);
        });
    }

}
