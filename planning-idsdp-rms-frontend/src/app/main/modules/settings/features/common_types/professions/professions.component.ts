import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { CommonTbl } from '../../../models/CommonTbl';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { FORM_TYPES } from '../../../constants/common.constants';
import { environment } from 'environments/environment';
import {
    refreshBtn,
    saveBtn,
    editBtn,
    deleteBtn,
} from '../../../constants/button.constants';
@Component({
    selector: 'app-professions',
    templateUrl: './professions.component.html',
    styleUrls: ['./professions.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfessionsComponent implements OnInit {
    /*----Button---*/
    refreshBtn = refreshBtn;
    saveBtn = saveBtn;
    editBtn = editBtn;
    deleteBtn = deleteBtn;
    /*----/Button---*/
    @ViewChild('inputForm') inputForm: NgForm;
    formTypes: any = FORM_TYPES;
    spinner: boolean = false;
    frmGroup: FormGroup;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    formTitle = ''; //Edit
    dataSet: CommonTbl[] = new Array<CommonTbl>();
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = [
        'position',
        'typeName',
        'forType',
        'active',
        'action',
    ];
    dataSource: any;
    baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
    someHtmlCode = '';
    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog
    ) {
        this.someHtmlCode =
            '<div style="font-size:50px; font-weight:bold; color:red;"><b>This is my HTML.</b></div>';
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        this.totalElements = this.dataSet.length;
        this.dataSource = new MatTableDataSource(this.dataSet);
    }
    ngOnInit(): void {
        this.formTitle = 'Add';
        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            typeNo: [''],
            typeName: ['', [this.globalVal.trimValidator('Type name')]],
            forType: ['', [this.globalVal.trimValidator('Form Type')]],
            active: ['true', Validators.required],
        });
        this.getListData();
    }
    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }
    getListData() {
        const getUrl =
            this.baseUrl + 'get-list/' + this.page + '/' + this.pageSize;
        this.api.get(getUrl).subscribe((res) => {
            this.spinner = false;
            this.dataSource = new MatTableDataSource(
                res.page ? res.page.content : []
            );
            this.totalElements = res.page ? res.page.totalElements : 0;
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
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }
    delete(rowUuid) {
        this.api.delete(this.baseUrl + 'delete/', rowUuid).subscribe((res) => {
            if (res.success) {
                this.toastr.success(res.message, 'Success!', this.config);
                this.getListData();
            } else {
                this.toastr.error(res.message, 'Error!', this.config);
            }
        });
    }
    editRow(data) {
        this.formTitle = 'Edit';
        this.frmGroup.patchValue(data);
        this.frmGroup.patchValue({ active: data.active.toString() });
        this.frmGroup.patchValue({ form_type: 'Profession' });
        console.log('Edit Data By ' + JSON.stringify(data));
    }
    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue);
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    setTypeNo(typeNoVal) {
        console.log('typeNoVal', typeNoVal.value);
        this.frmGroup.patchValue({ typeNo: '' });
        this.formTypes.map((val) => {
            if (val.title === typeNoVal.value) {
                this.frmGroup.patchValue({ typeNo: val.typeNo });
            }
        });
    }
    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        }
    }
    submitForm() {
        this.spinner = true;
        console.log('this.frmGroup.value', this.frmGroup.value);
        if (this.formTitle == 'Edit') {
            this.api
                .update(this.baseUrl + 'edit', this.frmGroup.value)
                .subscribe(
                    (res) => {
                        if (res.success > 0) {
                            this.spinner = false;
                            this.toastr.success(
                                res.message,
                                'Success!',
                                this.config
                            );
                            this.getListData();
                            this.formReset();
                        } else {
                            this.spinner = false;
                            this.toastr.error(
                                res.message,
                                'Error!',
                                this.config
                            );
                        }
                    },
                    (err) => {
                        this.toastr.error(
                            'Http Error Occord !.',
                            'Error!',
                            this.config
                        );
                    }
                );
        } else {
            this.api.post(this.baseUrl + 'add', this.frmGroup.value).subscribe(
                (res) => {
                    if (res.success > 0) {
                        this.toastr.success(
                            res.message,
                            'Success!',
                            this.config
                        );
                        this.getListData();
                        this.formReset();
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, 'Error!', this.config);
                    }
                },
                (err) => {
                    this.toastr.error(
                        'Http Error Occord !.',
                        'Error!',
                        this.config
                    );
                }
            );
        }
    }
    formReset() {
        this.formTitle = 'Add';
        this.frmGroup.reset();
        this.inputForm.resetForm();
        this.frmGroup.patchValue({ forType: '' });
        this.frmGroup.patchValue({ active: 'true' });
    }
    /*------------------------/Insert form functions----------------------*/
}
