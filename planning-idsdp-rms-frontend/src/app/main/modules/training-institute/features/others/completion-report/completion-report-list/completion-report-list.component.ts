import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../core/constants/constant";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../../../auth/services/auth.service";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {PageEvent} from "@angular/material/paginator";
import {CompletionReportService} from "../../../../services/completion-report.service";
import {CompletionReportResponseModel} from "../../../../models/completion-report-response.model";
import {ConfigurationService} from "../../../../../settings/services/configuration.service";

@Component({
    selector: 'app-completion-report-list',
    templateUrl: './completion-report-list.component.html',
    styleUrls: ['./completion-report-list.component.scss']
})
export class CompletionReportListComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'instituteName', 'totalParticipants', 'totalSessions',
        'duration', 'finalSubmit', 'action'];

    dataSource: MatTableDataSource<CompletionReportResponseModel>;

    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    fiscalYears: any [] = [];
    completionReports: CompletionReportResponseModel[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private route: Router,
                private dialog: MatDialog,
                private _toastService: ToastrService,
                private _authService: AuthService,
                private _completionReportService: CompletionReportService,
                private _configurationService: ConfigurationService) {

        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = true;
        this.getList();
        this.getFiscalYears();
    }

    getList() {
        this._completionReportService.getList(this.page, this.size).subscribe(
            res => {
                this.total = res.totalItems;
                this.completionReports = res.data;
                this.completionReports.map(
                    r => {
                        r.fiscalYear = this.getFiscalYearName(r.fiscalYearId);
                        r.submitted = r.isFinalSubmitted ? 'Yes' : 'No';
                    }
                )
                this.dataSource = new MatTableDataSource(this.completionReports);
            },
            () => {

            }
        );
        this.spinner = false;
    }

    viewDetails(id: number) {
        this.route.navigate(['completion-report/view/' + id]);
    }

    edit(id: number) {
        this.route.navigate(['completion-report/edit/' + id]);
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
        this.getList();
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

    private getFiscalYearName(fiscalYearId: number) {
        let fiscalYear = this.fiscalYears.find(fy => fy.id === fiscalYearId);

        if (fiscalYear)
            return fiscalYear.fiscalYear;
        else
            return "XYZ Fiscal Year";
    }
}
