import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DppProjectManagementSetupService } from 'app/main/modules/dpp-tapp-management/services/dpp-project-management-setup.service';
import { ReportService } from 'app/main/shared/services/report.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-project-management-setup-report',
  templateUrl: './project-management-setup-report.component.html',
  styleUrls: ['./project-management-setup-report.component.scss']
})
export class ProjectManagementSetupReportComponent implements OnInit {

  conceptUuid: string = '688936d5-a18c-4d06-b022-2d8d69155182';
  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';

  existingSetupList: any[] = [];
  executionSetupList: any[] = [];
  outSourcingList: any[] = [];


  constructor(
    private _service: DppProjectManagementSetupService,
    private _reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.getProjectManagementSetup();
  }



  getProjectManagementSetup() {
    this._service.getProjectManagementSetup(this.conceptUuid).subscribe(
      response => {
        let res = response.res;
        if (res) {
          this.existingSetupList = res.existingSetup ? res.existingSetup : [];
          this.executionSetupList = res.executionSetup ? res.executionSetup : [];
          this.outSourcingList = res.outSourcing ? res.outSourcing : [];
        }
      },
      err => {
      })
  }


  exportAsPdf(): void {
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'), 'project-management-setup-report');
  }

  exportAsXLSX(): void {
    let element = document.getElementById('pdfTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

}
