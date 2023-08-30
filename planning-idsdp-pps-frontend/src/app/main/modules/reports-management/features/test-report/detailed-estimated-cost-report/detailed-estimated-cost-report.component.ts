
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportCommonService } from 'app/main/core/services/report-common.service';
import { DppProjectManagementSetupService } from 'app/main/modules/dpp-tapp-management/services/dpp-project-management-setup.service';
import { ReportDataService } from 'app/main/shared/services/report-data.service';
import { ReportService } from 'app/main/shared/services/report.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { AnnualCostReportService } from "../../../../../shared/services/annual-cost-report.service";

@Component({
  selector: 'app-detailed-estimated-cost-report',
  templateUrl: './detailed-estimated-cost-report.component.html',
  styleUrls: ['./detailed-estimated-cost-report.component.scss']
})
export class DetailedEstimatedCostReportComponent implements OnInit {

  conceptUuid: string = '688936d5-a18c-4d06-b022-2d8d69155182';
  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';

  existingSetupList: any[] = [];
  executionSetupList: any[] = [];
  outSourcingList: any[] = [];

  uuIdForAnnexureFive: string = `688936d5-a18c-4d06-b022-2d8d69155182`;

  uuIdForAnnexureTwo: string = `28722394-b00f-469b-95fe-62ea20592f6d`;

  uuIdForAnnexureOne: string = `28722394-b00f-469b-95fe-62ea20592f6d`;
  uuIdForAnnexureFour: string = `a70ab6d3-ef77-4abf-873b-f3bdae0b0736`;


  constructor(
    private _service: DppProjectManagementSetupService,
    private _reportService: ReportService,

    private _annualCostReportService: AnnualCostReportService,
    private _reportDataService: ReportDataService,
    private _reportCommonService: ReportCommonService
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


  downloadAnnexureVaReport() {
    this._reportDataService.getAnnexureFiveAReport(this.uuIdForAnnexureFive).subscribe(
      res => {
        this._reportCommonService.previewReport(res, "PDF");
      }
    );
  }

  downloadAnnualCostReport() {
    this._annualCostReportService.getAnnualCostReport(this.uuIdForAnnexureFive).subscribe(
      res => {
        this._reportCommonService.previewReport(res, "PDF");
      }
    );
  }

  downloadAnnexureIIReport() {
    this._reportDataService.getAnnexureTwoReport(this.uuIdForAnnexureTwo).subscribe(
      res => {
        this._reportCommonService.previewReport(res, "PDF");
      }
    );
  }




}
