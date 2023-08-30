import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {EvaluatorsGrantAmountLetter} from "../../../../../rpm/models/EvaluatorsGrantAmountLetter";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {RmsEvaluatorsGrantAmountLetterService} from "../../../../../rpm/services/rms-evaluators-grant-amount-letter.service";
import {Router} from "@angular/router";
import {locale as lngEnglish} from "../../course-schedule/i18n/en";
import {locale as lngBangla} from "../../course-schedule/i18n/bn";
import {PageEvent} from "@angular/material/paginator";
import {addNewIcon, emailIcon, pdfIcon} from 'app/main/modules/rpm/constants/button.constants';
import {CourseService} from "../../../../services/course.service";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {ConfigurationService} from "../../../../../settings/services/configuration.service";
import {AuthService} from "../../../../../auth/services/auth.service";
import {  dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';

@Component({
    selector: 'app-course-schedule-list',
    templateUrl: './course-schedule-list.component.html',
    styleUrls: ['./course-schedule-list.component.scss']
})
export class CourseScheduleListComponent implements OnInit {
    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'trainersName', 'currentPosition', 'mobileNo', 'action'];
    dataSource: MatTableDataSource<any>;
    fiscalYearsList: any[];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;

    trainingInstitutes: any[] = [];
    fiscalYears: { id: number, fiscalYear: string, active: boolean }[] = [];
    userType: string;
    courseList: any[] = [];

    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;


    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private route: Router, private _toastService: ToastrService,
                private _courseService: CourseService,
                private dialog: MatDialog,
                private _configurationService: ConfigurationService,
                private _authService: AuthService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.userType = this._authService.getLoggedUserType();
        this.getAllTrainersInstitutesList();
        this.getFiscalYears();
        // this.getCourseList(this.size, this.page);
    }

    getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }

    getCourseList(size: number, page: number) {
        this.courseList = []

        this._courseService.getCourseList(size, page).subscribe(
            res => {
                if (this.userType === "Rms_DO") {
                    res.data.forEach(result => {
                        if (result.submitted === true) {
                            this.courseList.push(result);

                        }
                    })
                } else if (this._authService.getLoggedUserType() === "Rms_Training_Institute") {
                    res.data.forEach(result => {

                        this.courseList.push(result);
                    })
                }


                // this._toastService.success("Course Loaded");
                this.total = res.totalItems;
                this.dataSource = new MatTableDataSource<any>(this.courseList);

                let data: any[] = this.courseList;
                data.map(cs => {
                    cs.instituteName = this.getTrainingInstituteName(cs.createdBy)
                })
                console.log(data)
                this.dataSource = new MatTableDataSource<any>(data)
            },
            error => {
                console.log("Error: " + error);
            }
        )
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
        this.getCourseList(this.size, this.page);
    }

    viewDetails(uuid: string) {
        this.route.navigate(['course-schedules/list/' + uuid]);
    }

    edit(id: number) {
        this.route.navigate(['course-schedules/' + id + '/edit']);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
            _ => {
            }
        );
    }

    openDialog(id) {
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
                this.delete(id);
            }
            dialogRef.close(true);
        });
    }

    delete(id) {
        this._courseService.deleteCourse(id).subscribe(
            () => {
                this._toastService.success(deleteSuccess, "Success");
                this.getCourseList(this.size, this.page);
            },
            error => {
                this._toastService.error(deleteFailed, "Error");
                console.log("Error: " + error);
            }
        );
    }

    getTrainingInstituteName(createdBy: number) {

        let trainingInstitute = this.trainingInstitutes.find(ti => ti.id == createdBy);

        if (trainingInstitute)
            return trainingInstitute.name;
        else
            return "XYZ Institute";
    }

    private getAllTrainersInstitutesList() {
        this._authService.getAllUser().toPromise().then(
            result => {
                result.forEach(ti => {
                    // if (ti.userType === 'Rms_Training_Institute') {
                    this.trainingInstitutes.push(ti);
                    // }
                })

                this.getCourseList(this.size, this.page);
            },
            error => {
                console.log(error)
            }
        )
    }

    private getFiscalYears() {
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYears = res.items;
            },
            error => {
                console.log(error)
            }
        )
    }
}
