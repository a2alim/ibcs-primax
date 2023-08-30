import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportDataService } from 'app/main/shared/services/report-data.service';
import { ReportService } from 'app/main/shared/services/report.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-project-concept-report',
  templateUrl: './project-concept-report.component.html',
  styleUrls: ['./project-concept-report.component.scss']
})
export class ProjectConceptReportComponent implements OnInit {


  projectConceptUuid: string;

  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';


  reportData: any = {};


  constructor(
    private _reportService: ReportService,
    private _reportDataService: ReportDataService,
    private route: ActivatedRoute
  ) {
    this.projectConceptUuid = this.route.snapshot.params['uuid'];
  }

  ngOnInit(): void {
    this.getPcReportData();
  }

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
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'), 'PDPP_REPORT')
    //   let pdf=new jsPDF('l','pt','a4');
    //   pdf.html(this.el.nativeElement,{
    //     callback:(doc)=>{
    // doc.save("report1.pdf");
    //     }
    //   });   
  }


  getPcReportData() {
    console.log("<==== method call ==== > ");
    this._reportDataService.getPcRportData(this.projectConceptUuid).subscribe(
      res => {
        this.reportData = res ? res : {};
        console.log('reportData ====== > ', this.reportData);
      },
      err => {
        console.log('err====== > ', err)
      }
    );
  }

}
