import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
//----Lng Translation----
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {ApiService} from 'app/main/core/services/api/api.service';
import {ToastrService} from 'ngx-toastr';
import {GlobalValidationServiceService} from 'app/main/core/services/global-validation-service.service';
import {ProfessionTbl} from '../../models/ProfessionTbl';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from 'app/main/shared/constant/confirm.dialog.constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {SubmitConfirmationDialogComponent} from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ResearchCategoryTypeService} from '../../services/research-category-type.service';
import {CategoryWiseDeskOfficerService} from '../../services/category-wise-desk-officer.service';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {SectorTypeService} from '../../services/sector-type.service';
import {SubSectorService} from '../../services/sub-sector.service';
import {CommitteeTypeService} from '../../services/committee-type.service';
import {CommitteeSetupService} from '../../services/committee-setup.service';
import {UserListServiceService} from '../../services/user-list-service.service';
import {environment} from 'environments/environment';

@Component({
    selector: 'app-add-member-in-committee',
    templateUrl: './add-member-in-committee.component.html'
})
export class AddMemberInCommitteeComponent implements OnInit {

    frmGroup: FormGroup;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    formTitle = '';
    userList: any[] = [];

    dataSet: ProfessionTbl[] = new Array<ProfessionTbl>();
    headerTitle: string = 'Committee Setup';
    headerSubTitle: string = 'Home > Committee Setup';

    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = ['position', 'stFiscalYear', 'stCommitteeType', 'user', 'chairman', 'active', 'action'];
    dataSource: any;
    fiscalYearList = [];
    commiteeTypeList: any[] = [];
    spinner: boolean;
    @ViewChild('inputForm') inputForm: NgForm;

    baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/add-member-in-committee/';

    constructor(
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
        private _categoryWiseDeskOfficerService: CategoryWiseDeskOfficerService,
        private _sectorTypeService: SectorTypeService,
        private _subSectorService: SubSectorService,
        private _committeeTypeService: CommitteeTypeService,
        private _committeeSetupService: CommitteeSetupService,
        private api: ApiService,
        private toastr: ToastrService,
        private globalVal: GlobalValidationServiceService,
        private matSnackBar: SnackbarHelper,
        private dialog: MatDialog,
        private userListService: UserListServiceService,
    ) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.totalElements = this.dataSet.length;
        this.dataSource = new MatTableDataSource(this.dataSet);
    }

    async ngOnInit() {

        this.formTitle = 'Add';
        this.frmGroup = this.formBuilder.group({
            uuid: [''],
            stFiscalYearId: ['', Validators.required],
            stCommitteeTypeId: ['', Validators.required],
            userId: ['', Validators.required],
            isChairman: [1, Validators.required],
            active: ['true', Validators.required],
        });


        await this.getCommitteeTypeList();
        await this.getFiscalYearList();
        await this.getUserList();

    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListData();
    }

    getListData() {

        //this.spinner = true;
        let root = this;
        const getUrl = this.baseUrl + 'get-list/' + this.page + '/' + this.pageSize;
        this.api.get(getUrl).subscribe(res => {
            let dataVal: any = [];
            res.page.content.forEach(e => {
                let val: any = e;
                val.stFiscalYear = e.stFiscalYearId ? root.getFiscalYear(e.stFiscalYearId) : '';
                val.stCommitteeType = e.stCommitteeTypeId ? root.getCommitteeType(e.stCommitteeTypeId) : '';
                //e.stCommitteeTypeId ? root.commiteeTypeList.find( x => x.id === e.stCommitteeTypeId).committeeName : '';
                dataVal.push(val);
            });

            this.dataSource = new MatTableDataSource(res.page ? dataVal : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
            this.spinner = false;
        })
    }

    getFiscalYear(FY_ID) {
        let item = this.fiscalYearList.find(e => e.id === FY_ID);
        return item ? item.fiscalYear : "";
    }

    getCommitteeType(TypeId) {
        let item = this.commiteeTypeList.find(x => x.id === TypeId);
        return item ? item.committeeName : '';
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
        this.spinner = true;
        this.api.delete(this.baseUrl + 'delete/', rowUuid).subscribe(res => {
            if (res.success) {
                this.spinner = false;
                this.toastr.success(res.message, "Success!", this.config);
                this.getListData();
            } else {
                this.spinner = false;
                this.toastr.error(res.message, "Error!", this.config);
            }
        });
    }

    editRow(data) {
        this.formTitle = "Edit";
        this.frmGroup.patchValue(data);
        this.frmGroup.patchValue({active: data.active.toString()});
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /*------------------------Insert form functions----------------------*/
    onSubmit() {

        if (this.frmGroup.valid) {
            this.submitForm();
        }
    }

    submitForm() {
        this.spinner = true;
        if (this.formTitle == 'Edit') {
            this.api.update(this.baseUrl + 'edit', this.frmGroup.value).subscribe(
                res => {
                    if (res.success > 0) {
                        this.spinner = false;
                        this.toastr.success(res.message, "Success!", this.config);
                        this.getListData();
                        this.formReset();
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, "Error!", this.config);
                    }
                },
                _ => {
                    this.toastr.error('Http Error Occurred !.', "Error!", this.config);
                }
            )
        } else {
            this.api.post(this.baseUrl + 'add', this.frmGroup.value).subscribe(
                res => {
                    if (res.success > 0) {
                        this.toastr.success(res.message, "Success!", this.config);
                        this.getListData();
                        this.formReset();
                    } else {
                        this.spinner = false;
                        this.toastr.error(res.message, "Error!", this.config);
                    }
                },
                _ => {
                    this.toastr.error('Http Error Occurred !.', "Error!", this.config);
                }
            )
        }
    }

    formReset() {
        this.formTitle = 'Add';

        this.frmGroup.reset();
        this.inputForm.resetForm();
        this.frmGroup.patchValue({active: 'true'});
    }

    /*------------------------/Insert form functions----------------------*/

    getCommitteeTypeList() {
        this.spinner = true;
        let root = this;
        this._committeeTypeService.getAllActiveList().subscribe(
            res => {
                this.spinner = false;
                root.commiteeTypeList = res.items ? res.items : [];
            }
        );
    }


    getFiscalYearList() {
        let root = this;
        this.spinner = true;
        this._categoryWiseDeskOfficerService.getActiveFiscalYearList().subscribe(
            res => {
                this.spinner = false;
                root.fiscalYearList = res.items ? res.items : [];
            }
        );
    }

    compareFn(x: any, y: any): boolean {
        return x && y ? x.id === y.id : x === y;
    }

    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                this.getListData();
            }
        );

    }

}
