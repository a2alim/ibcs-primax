import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportDataService } from '../../../services/report-data.service';
import { ReportService } from "../../../services/report.service";

@Component({
    selector: 'app-test-report',
    templateUrl: './test-report.component.html',
    styleUrls: ['./test-report.component.scss']
})
export class TestReportComponent implements OnInit {
    name = 'Angular 6';
    @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;


    datas: any = [{
        "projectId": 'e101',
        "projectName": 'p1',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e102',
        "projectName": 'p2',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e103',
        "projectName": 'p3',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e101',
        "projectName": 'p1',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e102',
        "projectName": 'p2',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e103',
        "projectName": 'p3',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e101',
        "projectName": 'p1',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e102',
        "projectName": 'p2',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e103',
        "projectName": 'p3',
        author: 'Moniruzzaman Rony',
        budget: 1000
    }, {
        "projectId": 'e101',
        "projectName": 'p1',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e102',
        "projectName": 'p2',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e103',
        "projectName": 'p3',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e101',
        "projectName": 'p1',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e102',
        "projectName": 'p2',
        author: 'Moniruzzaman Rony',
        budget: 1000
    },
    {
        "projectId": 'e103',
        "projectName": 'p3',
        author: 'Moniruzzaman Rony',
        budget: 1000
    }];

    constructor(
        private _reportService: ReportService,
        private _reportDataService: ReportDataService
    ) { }

    ngOnInit(): void {
      //  this.getReportData();
    }

    exportAsXLSX(): void {
        this._reportService.exportAsExcelFile(this.datas, 'sample');
    }

    exportAsPdf(): void {
        this._reportService.exportAsPdfFile(document.getElementById('pdfTable'),'TEST_REPORT')
    }

    // getReportData() {
    //     this._reportDataService.getReportData().subscribe(
    //         res => {
    //         },
    //         err=>{
    //         }
    //     );
    // }
}
