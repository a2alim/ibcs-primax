import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportDataService } from '../../../services/report-data.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-projec-feasibility-study-report',
  templateUrl: './projec-feasibility-study-report.component.html',
  styleUrls: ['./projec-feasibility-study-report.component.scss']
})
export class ProjecFeasibilityStudyReportComponent implements OnInit {

  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';

  constructor(
    private _reportService: ReportService,
    private _reportDataService: ReportDataService
  ) { }

  ngOnInit(): void {
    this.getFeasibilityStudyReportData();
  }

  reportData: any = {};

  exportAsXLSX(): void {
    /* table id is passed over here */
    let element = document.getElementById('pdfTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  exportAsPdf(): void {
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'), 'feasibility-study-report')
      let pdf=new jsPDF('l','pt','a4');
      pdf.html(this.el.nativeElement,{
        callback:(doc)=>{
    doc.save("report1.pdf");
        }
      });
  }

  getFeasibilityStudyReportData() {
    this._reportDataService.getFeasibilityStudyReportData().subscribe(
      res => {
        this.reportData = res ? res.feasibilityStudyReportData : {};
      },
      err => {
      }
    );
  }
}
