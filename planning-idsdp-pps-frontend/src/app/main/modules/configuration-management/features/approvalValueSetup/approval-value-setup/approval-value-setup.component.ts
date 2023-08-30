import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngBangla} from '../approval-value-setup/i18n/bn';
import {locale as lngEnglish} from '../approval-value-setup/i18n/en';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {ApprovalValueSetupModel} from '../../../models/approval-value-setup-model';
import {ApprovalValueSetupService} from '../../../services/approval-value-setup.service';
import {UnsubscribeAdapterComponent} from '../../../../../core/helper/unsubscribeAdapter';
import {ParipatraVersion} from '../../../models/paripatra-version.model';
import {ProjectType} from '../../../models/project-type.model';
import {ParipatraVersionService} from '../../../services/paripatra-version.service';
import {ProjectTypeService} from '../../../services/project-type.service';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OK, SUCCESSFULLY_UPDATED} from 'app/main/core/constants/message';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../../layout/layouts/vertical/classy/i18n/en';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-list-page',
    templateUrl: './approval-value-setup.component.html',
    styleUrls: ['./approval-value-setup.component.scss'],
})
export class ApprovalValueSetupComponent extends UnsubscribeAdapterComponent implements OnInit {
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    model: ApprovalValueSetupModel = new ApprovalValueSetupModel();
    approvalValueSetupList: ApprovalValueSetupModel[] = new Array<ApprovalValueSetupModel>();
    displayedColumns: string[] = ['id', 'paripatroVersionNo', 'projectType', 'amount', 'description', 'status', 'action'];
    dataSource: MatTableDataSource<ApprovalValueSetupModel>;
    paripatroVersionNos: ParipatraVersion[] = [];
    projectTypes: ProjectType[] = [];
    moduleList: [];
    formTitle = 'Add Approval Value Setup';

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private formBuilder: FormBuilder,
        private approvalValueSetupService: ApprovalValueSetupService,
        private paripatraVersionService: ParipatraVersionService,
        private projectTypeService: ProjectTypeService,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        // this.dataSource = new MatTableDataSource(this.approvalValueSetupList);
    }

    ngOnInit(): void {
        this.actionPermission = lngEnglishAction.data.ACTION;
        this.frmGroup = this.formBuilder.group({
            paripatroVersionNo: ['', Validators.required],
            approvalValueForModule: ['', Validators.required],
            projectType: ['', Validators.required],
            amount: ['', Validators.required],
            description: ['', ''],
            status: ['true', Validators.required],
        });
        this.getListData();
        this.getParipatroVersionNos();
        this.getProjectTypes();
        this.approvalValueSetupService.getModuleList().subscribe(res => {
            this.moduleList = res
        });
    }

    private getParipatroVersionNos() {
        this.subscribe$.add(
            this.paripatraVersionService.getList().subscribe(res => {
                this.paripatroVersionNos = res.filter(e => e.status === true);
                // this.populateForm();
            })
        );
    }

    private getProjectTypes() {
        this.subscribe$.add(
            this.projectTypeService.getList().subscribe(res => {
                this.projectTypes = res.filter(e => e.status === true);
                // this.populateForm();
            })
        );
    }

    /*create() {
        this.model.paripatroVersionNo = this.frmGroup.value.paripatroVersionNo;
        this.model.approvalValueForModule = this.frmGroup.value.approvalValueForModule;
        this.model.projectType = this.frmGroup.value.projectType;
        this.model.amount = this.frmGroup.value.amount;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        console.log(this.model);
        this.approvalValueSetupService.create(this.model).subscribe(res => {
            this.resetValue();
            this.getListData();
        });
    }*/

    create() {
        const paripatroVersionNo = {
            id: this.frmGroup.value.paripatroVersionNo,
            nameEn: null
        }
        const projectType = {
            id: this.frmGroup.value.projectType,
            nameEn: null
        }


        this.model.paripatroVersionNo = paripatroVersionNo;
        this.model.approvalValueForModule = this.frmGroup.value.approvalValueForModule;
        this.model.projectType = projectType;
        this.model.amount = this.frmGroup.value.amount;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        console.log(this.model);
        this.subscribe$.add(
            this.approvalValueSetupService.create(this.model).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.resetValue();
                    this.getListData();
                }
            })
        );
    }

    edit(uuid: string) {
        this.editValue = true;
        console.log(uuid);
        this.approvalValueSetupService.getByUuid(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;
            this.model.code = res.code;
        });
    }

    update() {
        console.log(this.uuid);
        const paripatroVersionNo = {
            id: this.frmGroup.value.paripatroVersionNo,
            nameEn: null
        }
        const projectType = {
            id: this.frmGroup.value.projectType,
            nameEn: null
        }
        this.model.paripatroVersionNo = paripatroVersionNo;
        this.model.approvalValueForModule = this.frmGroup.value.approvalValueForModule;
        this.model.projectType = projectType;
        this.model.amount = this.frmGroup.value.amount;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        this.approvalValueSetupService.update(this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getListData();
        });
    }

    openDeleteDialog(uuid: string) {
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

                this.approvalValueSetupService.delete(uuid).subscribe(res => {
                    this.getListData();
                });
            }
            dialogRef.close(true);
        });

    }

    getListData() {
        this.approvalValueSetupList = [];
        this.approvalValueSetupService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(this.arrangeData(res.content));
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }

    arrangeData(res: ApprovalValueSetupModel[]) {
        return res.map(m => ({
            ...m,
            currentStatus: m.status ? 'Active' : 'Inactive',
            paripatra: m.paripatroVersionNo.nameEn,
            projectTypeName: m.projectType.nameEn
        }));
    }

    setValue(res: any) {
        console.log(res);
        this.frmGroup = this.formBuilder.group({
            paripatroVersionNo: [res.paripatroVersionNo.id],
            approvalValueForModule: [res.approvalValueForModule],
            projectType: [res.projectType.id],
            amount: [res.amount],
            description: [res.description],
            status: [res.status].toString(),
        });
    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            paripatroVersionNo: [''],
            approvalValueForModule: [''],
            projectType: [''],
            amount: [''],
            description: [''],
            status: ['true', Validators.required],
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

}

