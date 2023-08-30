import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as lngEnglish} from '../../unit/i18n/en';
import {locale as lngBangla} from '../../unit/i18n/bn';
import {ApprovalStatus} from '../../../models/approvalStatus.model';
import {ApprovalStatusService} from '../../../services/approvalStatusService.service';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { OK, SUCCESSFULLY_UPDATED } from 'app/main/core/constants/message';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {locale as lngEnglishAction} from '../../../../../../layout/layouts/vertical/classy/i18n/en';

@Component({
    selector: 'app-approval-status',
    templateUrl: './approval-status.component.html',
    styleUrls: ['./approval-status.component.scss']
})
export class ApprovalStatusComponent implements OnInit {

    // Variable Declaration
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    frmGroup: FormGroup;
    editValue: boolean;
    uuid: string;
    code: string;
    model: ApprovalStatus = new ApprovalStatus();
    dataSource: MatTableDataSource<ApprovalStatus>;
    approvalStatusesList: ApprovalStatus[] = new Array<ApprovalStatus>();

    actionPermission = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    formTitle = 'Approval Status';
    displayedColumns: string[] = ['id', 'approvalStatusName', 'approvalStatusNameBng', 'status', 'action'];
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private approvalStatusService: ApprovalStatusService,
        private formBuilder: FormBuilder,
        private snackbarHelper: SnackbarHelper,
        private dialog: MatDialog
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );

        this.dataSource = new MatTableDataSource(this.approvalStatusesList);
    }

    ngOnInit(): void {


        this.actionPermission = lngEnglishAction.data.ACTION;
        // this.frmGroup = this.formBuilder.group({
        //     approvalStatusName: ['', Validators.required],
        //     approvalStatusNameBng: ['', Validators.required],
        //     description: ['', ''],
        //     status: [true, Validators.required],
        // });
        this.populateForm(this.model);

        this.getApprovalStatusList();
    }
    private populateForm(model) {
        this.frmGroup = new FormGroup({
            uuid: new FormControl(''),
            approvalStatusName: new FormControl(''),
            approvalStatusNameBng: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            status: new FormControl('true', [Validators.required]),
        });
    }

    create() {

        /*if (this.frmGroup.valid) {
            console.log('ok ---');
        }*/

        this.model.approvalStatusName = this.frmGroup.value.approvalStatusName;
        this.model.approvalStatusNameBng = this.frmGroup.value.approvalStatusNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.approvalStatusService.create(this.model)
            .subscribe(
                data => {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.getApprovalStatusList();
                    this.resetValue();
                },
                error => {
                    if (error.status === 500) {

                    }
                });


    }


    getApprovalStatusList() {
        this.approvalStatusesList = [];
        this.approvalStatusService.getAllApprovalStatus().subscribe(res => {
            this.dataSource = new MatTableDataSource(res.map(m => ({...m, currentStatus: m.status ? 'Active' : 'Inactive'})));
            this.dataSource.paginator = this.paginator;
            this.total = res.length;
            // res.forEach(m => {
            //     console.log(m);
            //     this.approvalStatusesList.push(m);
            // });
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

    edit(uuid: string) {
        this.editValue = true;
        console.log(uuid);
        this.approvalStatusService.getByAllApprovalStatusBy(uuid).subscribe(res => {
            this.setValue(res);
            this.editValue = true;
            this.uuid = uuid;

        });
    }

    setValue(res: any) {

        this.frmGroup = this.formBuilder.group({
            approvalStatusName: [res.approvalStatusName],
            approvalStatusNameBng: [res.approvalStatusNameBng],
            description: [res.description],
            status:  [res.status].toString(),
        });
        this.model.code = res.code;

    }


    update() {
        this.model.approvalStatusName = this.frmGroup.value.approvalStatusName;
        this.model.approvalStatusNameBng = this.frmGroup.value.approvalStatusNameBng;
        this.model.description = this.frmGroup.value.description;
        this.model.status = this.frmGroup.value.status;
        this.model.uuid = this.uuid;
        //this.approvalStatusService.updateByAllApprovalStatusBy(this.model.uuid, this.model.approvalStatusName,
            //this.model.approvalStatusNameBng, this.model.description , this.model.status)
        this.approvalStatusService.updateApprovalStatus(this.model.uuid,this.model).subscribe(res => {
            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
            this.resetValue();
            this.editValue = false;
            this.uuid = '';
            this.model.uuid = '';
            this.getApprovalStatusList();
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
                this.approvalStatusService.deleteFeature(uuid).subscribe(res => {
                    this.getApprovalStatusList();
                });
            }
            dialogRef.close(true);
        });


    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        // this.getListData();
    }

    resetValue() {
        this.frmGroup = this.formBuilder.group({
            approvalStatusName: [''],
            approvalStatusNameBng: [''],
            description: [''],
            status: [''],
        });
    }

    getListData() {
        this.approvalStatusesList = [];
        this.approvalStatusService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.content);
            this.dataSource.paginator = this.paginator;
            this.total = res.totalElements;
            // res.forEach(m => {
            //     this.unitTypeList.push(m);
            // });
        });
    }
}
