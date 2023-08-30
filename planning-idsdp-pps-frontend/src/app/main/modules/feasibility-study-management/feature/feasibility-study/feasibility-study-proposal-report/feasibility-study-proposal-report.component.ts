import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ModeOfFinanceConfigService } from 'app/main/modules/configuration-management/services/mode-of-finance.service';
import { EconomicCodeService } from 'app/main/modules/configuration-management/services/economic-code-service.service';
import { SubEconomicCodeService } from 'app/main/modules/configuration-management/services/sub-economic-code.service';
import { EconomicTypeModel } from 'app/main/modules/configuration-management/models/economic-code-model';
import { SubEconomicCodeModel } from 'app/main/modules/configuration-management/models/sub-economic-code-model';
import { PaSourceService } from 'app/main/modules/configuration-management/services/pa-source.service';
import { IPaSourceModel } from 'app/main/modules/configuration-management/models/pa-source.model';
import { ReportDataService } from 'app/main/modules/reports-management/services/report-data.service';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'app/main/shared/services/report.service';




@Component({
  selector: 'app-feasibility-study-proposal-report',
  templateUrl: './feasibility-study-proposal-report.component.html',
  styleUrls: ['./feasibility-study-proposal-report.component.scss']
})
export class FeasibilityStudyProposalReportComponent implements OnInit {


  projectConceptUuid: string = '';





  @ViewChild('pdfTable', { static: false }) el: ElementRef;
  fileName = 'ExcelSheet.xlsx';

  expenditureCostList: any[] = [];
  modeOfFinanceList: [] = [];
  feasibilityStudyProposalData: any = {};
  reportData: any = {};

  // for setup data
  configModeList: any[] = [];
  economicListAll: EconomicTypeModel[] = [];
  subEconomicAllList: SubEconomicCodeModel[] = [];
  paSourceList: Array<IPaSourceModel> = new Array<IPaSourceModel>();


  constructor(
    private _reportService: ReportService,
    private _reportDataService: ReportDataService,
    private _modeOfFinanceConfigService: ModeOfFinanceConfigService,
    private _economicCodeService: EconomicCodeService,
    private _subEconomicCodeService: SubEconomicCodeService,
    private paSourceService: PaSourceService,
    private route: ActivatedRoute
  ) {
    this.projectConceptUuid = this.route.snapshot.params['uuid'];
  }

  ngOnInit(): void {
    this.getConfigModeList(() => {
      this.getActiveEconomicCode(() => {
        this.getSubEconomicCodeAll(() => {
          this.getConfigPaSourceList(() => {
            this.getPfsReportData();
          });
        });
      });
    });
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
    this._reportService.exportAsPdfFile(document.getElementById('pdfTable'), 'FPS_REPORT');
  }

  getPfsReportData() {
    this._reportDataService.getPfsReportData(this.projectConceptUuid).subscribe(
      res => {
        this.feasibilityStudyProposalData = res ? res.feasibilityStudyProposalData : {};
        this.modeOfFinanceList = res ? res.modeOfFinanceList : [];
        this.expenditureCostList = res ? res.expenditureCostList : [];
      },
      err => {
        console.log('err====== > ', err)
      }
    );
  }


  private getConfigModeList(callback) {
    this._modeOfFinanceConfigService.getList().subscribe(res => {
      this.configModeList = res;
      callback(true);
    });
  }

  getActiveEconomicCode(callback) {
    this._economicCodeService.fetchActiveEconomicCodeList().subscribe(res => {
      this.economicListAll = res;
      callback(true);
    });
  }

  getSubEconomicCodeAll(callback) {
    this.subEconomicAllList = [];
    this._subEconomicCodeService.getActiveSubEconomicCodeList().subscribe(res => {
      this.subEconomicAllList = res;
      callback(true);
    });
  }


  private getConfigPaSourceList(callback) {
    this.paSourceService.getActivePaSource().subscribe(res => {
      this.paSourceList = res;
      console.log('paSourceList ==== > ', this.paSourceList);
      callback(true);
    });
  }

}
