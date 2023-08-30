import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ZillaModel} from '../../models/zilla.model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {ZillaService} from '../../services/zilla.service';
import {DivisionService} from '../../services/division.service';
import {DivisionModel} from '../../models/division.model';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {locale as lngEnglishAction} from "../../../../../layout/layouts/vertical/classy/i18n/en";


@Component({
  selector: 'app-zilla',
  templateUrl: './zilla.component.html',
  styleUrls: ['./zilla.component.scss']
})
export class ZillaComponent implements OnInit {
    model: ZillaModel = new ZillaModel();
    zillaList: ZillaModel[] = new Array<ZillaModel>();
    divisionList: DivisionModel[] = new Array<DivisionModel>();
    editValue: boolean;
    disableDelete: boolean;
    frmGroup: FormGroup;
    uuid: string;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    displayedColumns: string[] = ['uuid', 'nameEn', 'nameBn', 'geoCode', 'dvsn', 'status', 'action'];
    dataSource = new MatTableDataSource(this.zillaList);

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private zillaService: ZillaService,
        private divisionService: DivisionService,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.dataSource = new MatTableDataSource(this.zillaList);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.resetValue();
        this.getZilla();
        this.getDivision();

    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            divisionId: ['', Validators.required],
            geoCode: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }


    create() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.divisionId = this.frmGroup.value.divisionId;
        this.model.status = this.frmGroup.value.status;
        if (this.model.nameBn && this.model.nameEn && this.model.status) {
            this.zillaService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getZilla();
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
    edit(row: ZillaModel) {
        console.log('Edit Called');
        this.disableDelete = true;
        this.editValue = true;
        this.uuid = row.uuid;
        this.frmGroup.patchValue({
            uuid: row.uuid,
            geoCode: row.geoCode,
            nameEnglish: row.nameEn,
            nameBangla: row.nameBn,
            divisionId: this.findDivisionName(row.divisionId),
            description: row.description,
            status: row.status.toString(),
        });
    }

    findDivisionName(res: any) {
        console.log(res);
        for( let i = 0; i < this.divisionList.length; i++) {
            if (res == this.divisionList[i].id) {
                const name = this.divisionList[i].id;
                return name;
            }
        }
    }

    update() {
        this.disableDelete = false;
        this.model.uuid = this.uuid;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.divisionId = this.frmGroup.value.divisionId;
        this.model.status = this.frmGroup.value.status;
        this.zillaService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBar();
            this.resetValue();
            this.getZilla();
            this.editValue = false;
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    delete(uuid: string) {
        this.zillaService.delete(uuid).subscribe(res => {
            this.getZilla();
        });
    }


    getZilla() {
        this.zillaList = [];
        this.zillaService.getListWithPagination(this.page, this.size).subscribe(res => {
            console.log(res);
            this.dataSource = new MatTableDataSource(res.content.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.total = res.totalElements;
        });
    }

    getDivision() {
        this.divisionList = [];
        this.divisionService.getList().subscribe(res => {
            res.forEach(m => {
                this.divisionList.push(m);

            });
        });
        console.log(this.divisionList);
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
        this.getZilla();
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
