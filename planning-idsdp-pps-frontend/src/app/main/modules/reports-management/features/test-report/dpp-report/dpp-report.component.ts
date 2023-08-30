import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportDataService } from '../../../services/report-data.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-dpp-report',
  templateUrl: './dpp-report.component.html',
  styleUrls: ['./dpp-report.component.scss']
})
export class DppReportComponent implements OnInit {

  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';

  constructor(
    private _reportService: ReportService,
    private _reportDataService: ReportDataService
  ) { }

  ngOnInit(): void {
    this.getPfsReportData();
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
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'),'DPP_REPORT')
    //   let pdf=new jsPDF('l','pt','a4');
    //   pdf.html(this.el.nativeElement,{
    //     callback:(doc)=>{
    // doc.save("report1.pdf");
    //     }
    //   });
  }

  getPfsReportData() {
    this._reportDataService.getPfsReportData('dddddd').subscribe(
      res => {
        this.reportData = res ? res : {};
      },
      err => {
      }
    );
  }

}
