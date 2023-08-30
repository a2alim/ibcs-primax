import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../unit/i18n/en';
import {locale as lngBangla} from '../unit/i18n/bn';
import {MunicipalityModel} from '../../models/municipality.model';
import {MunicipalityService} from '../../services/municipality.service';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {UpazillaModel} from '../../models/upazilla.model';
import {UpazillaService} from '../../services/upazilla.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
    selector: 'app-municipality',
    templateUrl: './municipality.component.html',
    styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    model: MunicipalityModel = new MunicipalityModel();
    municipalityList: MunicipalityModel[] = new Array<MunicipalityModel>();
    upazilaModel: UpazillaModel = new UpazillaModel();
    upazilaList: UpazillaModel[] = new Array<UpazillaModel>();
    editValue: boolean;
    uuid: string;
    disableDelete: boolean;
    frmGroup: FormGroup;
    displayedColumns: string[] = ['uuid', 'nameEn', 'nameBn', 'geoCode', 'upaZilla', 'status', 'action'];
    dataSource: MatTableDataSource<MunicipalityModel>;

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private municipalityService: MunicipalityService,
        private upazillaService: UpazillaService,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    /*
     * when municipality component is initialize ngOnInit method firstly load
     */

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.getMunicipality();
        this.getUpazilla();
        this.dataSource = new MatTableDataSource(this.municipalityList);
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            upazilaId: ['', Validators.required],
            geoCode: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }


    /*
    Create for municipality
    */

    create() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.upazilaId = this.frmGroup.value.upazilaId;
        this.model.status = this.frmGroup.value.status;
        if (this.model.nameBn && this.model.nameEn && this.model.status) {
            this.municipalityService.create(this.model).subscribe(res => {
                this.snackbarHelper.openSuccessSnackBar();
                this.resetValue();
                this.getMunicipality();
            }, error => {
                this.snackbarHelper.openErrorSnackBar();
            });
        }
    }

    /*
   edit for municipality
    */

    edit(uuid: string) {
        this.disableDelete = true;
        this.municipalityService.getByUuid(uuid).subscribe(res => {
            console.log(res);
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
        });
    }


    /*
   update for municipality
    */
    update() {
        this.disableDelete = false;
        this.model.nameBn = this.frmGroup.value.nameBangla;
        this.model.nameEn = this.frmGroup.value.nameEnglish;
        this.model.description = this.frmGroup.value.description;
        this.model.geoCode = this.frmGroup.value.geoCode;
        this.model.upazilaId = this.frmGroup.value.upazilaId;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.municipalityService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage('Successfully Data Updated', 'OK');
            this.resetValue();
            this.getMunicipality();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
        }, error => {
            this.snackbarHelper.openErrorSnackBar();
        });
    }

    /*
     delete for municipality
     */
    delete(uuid: string) {
        this.municipalityService.delete(uuid).subscribe(res => {
            this.getMunicipality();
        });
    }


    /*
     Get Municipality
     */

    getMunicipality() {
        this.municipalityList = [];
        this.municipalityService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content.map(m => ({
                ...m,
                upazilla: m.upaZilla.nameEn,
                currentStatus: m.status ? 'Active' : 'Inactive'
            })));
            this.total = res.totalElements;
            // res.content.forEach(m => {
            //     this.municipalityList.push(m);
            // });
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /*
     Search Municipality
     */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    /*
     set form  value Municipality
     */

    setValue(res: any): any {
        this.frmGroup.get('nameBangla').setValue(res.nameBn);
        this.frmGroup.get('nameEnglish').setValue(res.nameEn);
        const name = res.status.toString();
        this.frmGroup.get('status').setValue(name);
        this.frmGroup.get('geoCode').setValue(res.geoCode);
        this.frmGroup.get('description').setValue(res.description);
        this.frmGroup.get('upazilaId').setValue(res.upaZilla.id);
    }

    /*
     resetValue value form Municipality
     */
    resetValue(): any {
        this.frmGroup = this.formBuilder.group({
            nameBangla: ['', Validators.required],
            nameEnglish: ['', Validators.required],
            upazilaId: ['', Validators.required],
            geoCode: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
    }

    /*
     change value form Municipality
     */

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getMunicipality();
    }


    /*
     Get Upazilla
     */

    getUpazilla() {
        this.upazilaList = [];
        this.upazillaService.getList().subscribe(res => {
            res.forEach(m => {
                this.upazilaList.push(m);

            });
        });
        console.log(this.upazilaList);
    }

    /*
    Reset form value
     */
    reset() {
        this.resetValue();
        this.disableDelete = false;
        this.editValue = false;
    }


    /*
    open dialog for delete element
     */

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
