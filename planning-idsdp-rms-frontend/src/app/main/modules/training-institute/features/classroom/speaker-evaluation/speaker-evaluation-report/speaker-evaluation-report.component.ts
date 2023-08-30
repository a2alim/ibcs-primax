import {Component, OnInit} from '@angular/core';
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {addNewIcon, emailIcon, pdfIcon, uploadIcon, viewIcon} from '../../../../constants/button.constants';
import {SpeakerEvaluationService} from 'app/main/modules/training-institute/services/speaker-evaluation.service';
import {SpeakerEvaluationReportModel} from 'app/main/modules/training-institute/models/speaker-evaluation-report.model';

@Component({
    selector: 'app-speaker-evaluation-report',
    templateUrl: './speaker-evaluation-report.component.html',
    styleUrls: ['./speaker-evaluation-report.component.scss']
})
export class SpeakerEvaluationReportComponent implements OnInit {

    spinner: boolean = false;
    displayedColumns: string[] = ['sl', 'sessionTopic', 'courseTitle', 'sessionTitle', 'speakerName', 'studentName', 'qsn1', 'qsn2', 'qsn3'];
    dataSource: MatTableDataSource<SpeakerEvaluationReportModel>;
    total: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    addNewIcon = addNewIcon;
    emailIcon = emailIcon;
    pdfIcon = pdfIcon;
    viewIcon = viewIcon;
    uploadIcon = uploadIcon;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _speakerEvaluationService: SpeakerEvaluationService) {
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {

        this.spinner = true;
        this.getSpeakerEvaluationReports();
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getSpeakerEvaluationReports()
    }

    viewDetails() {
        //   this.route.navigate(['progress-verification/view/' + id]);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }

        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    private getSpeakerEvaluationReports() {
        this._speakerEvaluationService.getSpeakerEvaluationReports(this.size, this.page).subscribe(
            res => {
                this.dataSource = new MatTableDataSource(res.data);               
                this.total = res.totalItems;
                this.spinner = false;
            },
            error => {
                this.spinner = false;
                console.log(error);
            }
        )
    }


}
