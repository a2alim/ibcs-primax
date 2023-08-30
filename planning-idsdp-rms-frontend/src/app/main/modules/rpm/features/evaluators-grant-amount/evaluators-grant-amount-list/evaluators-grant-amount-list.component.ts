import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {RmsEvaluatorsGrantAmountLetterService} from "../../../services/rms-evaluators-grant-amount-letter.service";
import {MatTableDataSource} from "@angular/material/table";
import {EvaluatorsGrantAmountLetter} from "../../../models/EvaluatorsGrantAmountLetter";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {addNewIcon} from '../../../constants/button.constants';
import {PageEvent} from "@angular/material/paginator";
import {FiscalYearServiceService} from "../../../../settings/services/fiscal-year-service.service";
import {Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../core/helper/snackbar.helper";

@Component({
    selector: 'app-evaluators-grant-amount-list',
    templateUrl: './evaluators-grant-amount-list.component.html',
    styleUrls: ['./evaluators-grant-amount-list.component.scss']
})
export class EvaluatorsGrantAmountListComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner: boolean = true;
    displayedColumns: string[] = ['sl', 'fiscalYear', 'approvedFile', 'action'];
    dataSource: MatTableDataSource<EvaluatorsGrantAmountLetter>;
    fiscalYearsList: any[];
    fiscalYearId: number;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    addNewIcon = addNewIcon;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private fiscalYearService: FiscalYearServiceService,
                private route: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getFiscalYears();
        this.getList();
    }

    private getFiscalYears() {
        this.spinner = true;
        this.subscribe$.add(
            this.fiscalYearService.getAllActive().subscribe(res => {
                this.fiscalYearsList = res.items ? res.items : [];
                this.spinner = false;
            })
        );
    }

    getList() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getListWithPagination(this.page, this.size).subscribe(res => {
                if (res.success) {
                    this.dataSource = new MatTableDataSource(res.page?.content);
                    this.total = res.page?.totalElements;
                    this.spinner = false;
                }
            })
        );
    }

    getListByFiscalYear() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getByFiscalYearId(this.fiscalYearId, this.page, this.size).subscribe(res => {
                if (res.success) {
                    this.dataSource = new MatTableDataSource(res.page?.content);
                    this.total = res.page?.totalElements;
                    this.spinner = false;
                }
            })
        );
    }

    uploadFile(file: FileList, id: number) {
        this.spinner = true;
        this.service.uploadFile(file.item(0), id).subscribe(res => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.onChangeFiscalYear();
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                }
            }, _ => {
                this.spinner = false;
            }
        );
    }

    onChangePage(event: PageEvent) {

        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.fiscalYearId ? this.getListByFiscalYear() : this.getList();
    }

    onChangeFiscalYear() {
        this.fiscalYearId ? this.getListByFiscalYear() : this.getList();
    }

    viewDetails(uuid: string) {
        this.route.navigate(['evaluator-grant-amount-details/' + uuid]);
    }

    edit(uuid: string) {
        this.route.navigate(['evaluator-grant-amount/edit/' + uuid]);
    }

    download(letter: EvaluatorsGrantAmountLetter) {
        this.service.downloadFile(letter.uploadSignatureFile).subscribe(
        _ => {}
        );
    }
}
