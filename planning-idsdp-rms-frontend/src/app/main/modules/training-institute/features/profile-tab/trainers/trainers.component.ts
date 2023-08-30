import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { ApiService } from 'app/main/core/services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from 'app/main/core/services/global-validation-service.service';
import { DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { deleteIcon, editIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from '../../../constants/button.constants';
import { FiscalYearServiceService } from "../../../../settings/services/fiscal-year-service.service";
import { PageEvent } from "@angular/material/paginator";
import { ConfirmDialogConstant } from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { TrainersService } from "../../../services/trainers.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-trainers',
    templateUrl: './trainers.component.html',
    styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent implements OnInit {
    private profileuuid: string;

    constructor(private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private api: ApiService,
        private fiscalYearService: FiscalYearServiceService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private trainersservice: TrainersService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _toastrService: ToastrService,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    @ViewChild('inputForm') inputForm: NgForm;
    /*----Button---*/
    refreshBtn = refreshIcon;
    saveBtn = saveIcon;
    editBtn = editIcon;
    deleteBtn = deleteIcon;
    previousIcon = previousIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    spinner: boolean = false;
    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = ''; //Edit

    headerTitle: string = 'Test Comp';
    headerSubTitle: string = 'Home > Test Component';

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'name', 'institute', 'designation', 'mobileNo', 'gender', 'email', 'lastAcademicDeg', 'action'];
    dataSource: any;
    isView: boolean = false

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    ngOnInit(): void {
        this.profileuuid = this._activatedRoute.snapshot.paramMap.get('uuid');
        this.formTitle = 'Add';
        this.frmGroup = this.formBuilder.group({
            profileModel: [],
            profileId: [],
            id: [],
            uuid: [''],
            name: ['', this.globalVal.trimValidator('Name')],
            institute: ['', this.globalVal.trimValidator('Institute')],
            designation: ['', this.globalVal.trimValidator('Designation')],
            mobileNo: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
            gender: ['', this.globalVal.trimValidator('Gender')],
            email: ['', [Validators.required, Validators.email]],
            lastAcademicDeg: ['', this.globalVal.trimValidator('Last academic degree')],
        });
        this.spinner = true
        // setTimeout(()=>{this.getListData(this.trainersservice.profileId)},4000)
        this.getListData(this.trainersservice.profileId);
    }




    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData(localStorage.getItem('ProfileIdForM3'));
    }

    getListData(profileid) {
        this.trainersservice.getListData(profileid, this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
        this.spinner = false
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
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.delete(rowUuid);
            }
            dialogRef.close(true);
        });
    }

    delete(rowUuid) {
        this.trainersservice.delete(rowUuid).subscribe(res => {
            if (res.success) {
                this.toastr.success(res.message, "Success!", this.config);
                this.getListData(localStorage.getItem('ProfileIdForM3'));
            }
            else {
                this.toastr.warning(res.message, "Failed!", this.config);
            }
        }, error => {
            this.toastr.error('Http Error!!!', "Error!", this.config);
        });
    }

    editRow(data) {
        this.formTitle = "Edit";
        this.frmGroup.patchValue(data);
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue)
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*------------------------Insert form functions----------------------*/
    onSubmit() {
        if (this.frmGroup.valid) {
            this.submitForm();
        } else {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
        }
    }


    submitForm() {
        this.spinner = true;
        if (this.formTitle == 'Edit') {
            this.trainersservice.updateData(this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.spinner = false;
                        this.toastr.success(res.message, "Success!", this.config);
                        if (this.isView) {
                            this._router.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$' + this.profileuuid]);
                        }
                        this.formReset();
                        this.getListData(localStorage.getItem('ProfileIdForM3'));

                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, "Error!", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        }
        else {
            this.frmGroup.patchValue({ profileId: localStorage.getItem('ProfileIdForM3') })
            this.trainersservice.saveData(this.frmGroup.value).subscribe(
                res => {
                    if (res.success) {
                        this.spinner = false;
                        this.toastr.success(res.message, "Success!", this.config);
                        if (this.isView) {
                            this._router.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$' + this.profileuuid]);
                        }
                        this.formReset();
                        this.getListData(localStorage.getItem('ProfileIdForM3'));
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, "Error!", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occord !.', "Error!", this.config);
                }
            )
        }
    }

    formReset() {
        this.formTitle = 'Add';
        this.frmGroup.reset();
        this.inputForm.resetForm();
        this.frmGroup.patchValue({ active: 'true' });
    }
    /*------------------------/Insert form functions----------------------*/




    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    goToProfile() {
        this.isView = true;
    }

}
