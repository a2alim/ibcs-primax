import { Component, OnInit } from '@angular/core';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    addNewIcon,
    dataNotFount,
    deleteFailed,
    deleteSuccess,
    downloadIcon,
    previousIcon,
    printIcon,
    saveFailed,
    saveSuccess,
    sentSuccess,
    updateFailed,
    updateSuccess,
} from 'app/main/modules/rpm/constants/button.constants';
import { GuarantorService } from 'app/main/modules/training-institute/services/guarantor.service';
import { GuarantorResponse } from 'app/main/modules/training-institute/models/guarantor-response.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ConfigurationService } from '../../../../../settings/services/configuration.service';
import { BudgetService } from 'app/main/modules/training-institute/services/budget.service';
import { CourseService } from '../../../../services/course.service';
import { CourseResponse } from '../../../../models/course-response.model';
import { uploadIcon } from 'app/main/modules/training-institute/constants/button.constants';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { reportBackend } from 'environments/environment';
import * as bl2Js from 'bl2-js-report';

@Component({
    selector: 'app-guarantor-list',
    templateUrl: './guarantor-list.component.html',
    styleUrls: ['./guarantor-list.component.scss'],
})
export class GuarantorListComponent implements OnInit {
    spinner: boolean = false;
    displayedColumns: string[] = [
        'sl',
        'instituteName',
        'guarantorName',
        'mobileNo',
        'refundDays',
        'action',
    ];
    dataSource: MatTableDataSource<any>;
    fiscalYearsList: any[];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    name: string = '';
    details: any;
    list: boolean = true;
    view: boolean = false;
    delete: boolean = false;

    addNewIcon = addNewIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    previousIcon = previousIcon;
    uploadIcon = uploadIcon;

    trainingInstitutes: any[] = [];
    researchBudgetResponses: any[] = [];
    budgetView: number = 0;
    private courseList: CourseResponse[];
    fiscalYears: any[];

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;

    data: any[] = [];

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private route: Router,
        private _toastService: ToastrService,
        private _guarantorService: GuarantorService,
        private dialog: MatDialog,
        private _authService: AuthService,
        private _budgetService: BudgetService,
        private _configurationService: ConfigurationService,
        private _courseService: CourseService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.spinner = true;
        this.getFiscalYears();
        this.getGuarantorList(this.size, this.page, this.name);
    }

    search() {
        this.getGuarantorList(this.size, this.page, this.name);
    }

    getTrainingInstituteName(createdBy: number) {
        let trainingInstitute = this.trainingInstitutes.find(
            (ti) => ti.id == createdBy
        );

        if (trainingInstitute) return trainingInstitute.name;
        else return 'XYZ Institute';
    }

    getCourseList() {
        this._courseService.getCourseList(2000, 0).subscribe(
            (res) => {
                this.courseList = res.data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getGuarantorList(size: number, page: number, name: string) {
        this._guarantorService.getGuarantorList(size, page, name).subscribe(
            (res) => {
                this.total = res.totalItems;

                this._configurationService
                    .getFiscalYearList()
                    .toPromise()
                    .then(
                        (res2) => {
                            this.fiscalYears = res2.items;

                            let data: any[] = res.data;

                            for (let i = 0; i < data.length; i++) {
                                data[i].instituteName =
                                    data[
                                        i
                                    ].proposalModel.trainingInstituteProfileModel.trainingInstituteName;
                                data[i].fiscalYear = this.getFiscalYearName(
                                    data[i].fiscalYearId
                                );
                                data[i].active = data[i].isActive
                                    ? 'Yes'
                                    : 'No';
                            }
                            console.log(data);
                            this.dataSource = new MatTableDataSource(data);
                            this.spinner = false;
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
            },
            (error) => {
                this.spinner = false;
                console.log('Error: ' + error);
            }
        );
    }

    print() {
        window.print();
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find((fy) => fy.id === fiscalYearId);

        if (fiscalYear) return fiscalYear.fiscalYear;
        else return 'XYZ Fiscal Year';
    }

    deleteGuarantor(guarantorId: number) {
        this._guarantorService.deleteGuarantor(guarantorId).subscribe(
            () => {
                this._toastService.success(deleteSuccess, 'Success');
                this.getGuarantorList(this.size, this.page, this.name);
            },
            (error) => {
                this._toastService.error(deleteFailed, 'Error');
                console.log('Error: ' + error);
            }
        );
    }

    openDialog(guarantorId: number) {
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
                this.deleteGuarantor(guarantorId);
            }
            dialogRef.close(true);
        });
    }

    seeDetails(element: any) {
        this.details = element;
        this.list = false;
        this.view = true;
        this.getBudgetData(element);
    }

    getBudgetData(element: GuarantorResponse) {
        //need to chenge
        this._budgetService.getListData(2000, 0, 41).subscribe(
            (res) => {
                this.researchBudgetResponses = res.data;
                res.data.map((item) => {
                    if (item.fiscalYearId == element.fiscalYearId) {
                        this.budgetView =
                            this.budgetView + item.expenditureAmount;
                    }
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getListByFiscalYear() {

    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getGuarantorList(this.size, this.page, this.name);
    }

    hideDetails() {
        this.list = true;
        this.view = false;
    }

    edit(id: number) {
        this.route.navigate(['guarantor-list/edit/' + id]);
    }

    download($fileName = '') {
        // this.courseScheduleList;

        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/guarantorsAgreements';
        this.data['lng'] = localStorage.getItem('currentLang');

        this.data['details'] = JSON.stringify(this.details);
        this.data['budgetView'] = this.budgetView;

        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getCourseNameById(courseId: number) {
        let course = this.courseList.find((cs) => cs.id == courseId);
        if (course) return course.courseTitle;
        else return 'XYZ Course';
    }

    openSendUploadDialog(id: number, getVal) {
        console.log(getVal, '<<<<<<< ---------------- getVal -------------- >>>>>> ');

        sessionStorage.upid = id;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE, ...getVal.uploadFile };
        const dialogRef = this.dialog.open(UploadModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this._toastService.success('Uploaded!', 'Success');
                this.dataSource = null;
                this.getGuarantorList(this.size, this.page, this.name);
            }
            console.log('res ----- >>>>> ',res);
            // dialogRef.close(true);
        });
    }

    private getFiscalYears() {
        this._configurationService.getAllFiscalYearByFinalCopy().toPromise().then(
                (res) => {
                    this.fiscalYearsList = res.items;
                },
                (error) => {
                    console.log(error);
                }
            );
    }
}
